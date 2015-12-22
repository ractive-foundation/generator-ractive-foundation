var fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	plugins = require('gulp-load-plugins')(),
	del = require('del'),
	glob = require('simple-glob'),
	path = require('path'),
	mergeStream = require('merge-stream'),
	jscs = require('gulp-jscs'),
	runSequence = require('run-sequence'),
	ractiveParse = require('./node_modules/ractive-foundation/tasks/ractiveParse'),
	seleniumServer = require('./node_modules/ractive-foundation/tasks/seleniumServer'),
	rfCucumber = require('./node_modules/ractive-foundation/tasks/rfCucumber'),
	renderDocumentation = require('./node_modules/ractive-foundation/tasks/renderDocumentation'),
	concatManifests = require('./node_modules/ractive-foundation/tasks/concatManifests'),
	jshintFailReporter = require('./node_modules/ractive-foundation/tasks/jshintFailReporter'),
	rfA11y = require('./node_modules/ractive-foundation/tasks/rfA11y'),

	pkg = require('./package.json');

// All config information is stored in the .yo-rc.json file so that yeoman can
// also get to this information
var config = JSON.parse(fs.readFileSync('./.yo-rc.json'))['generator-ractive-foundation'];
config.globs.srcBuild = config.globs.srcJavaScript.slice();
config.globs.srcBuild.push(config.globs.partials);
config.globs.srcBuild.push(config.globs.componentsScss);
config.globs.srcBuild.push(config.globs.templates);
config.globs.srcBuild.push(config.globs.scss);

// Server reference, used in multiple gulp tasks.
var liveServer = plugins.liveServer.new('server.js');


gulp.task('connect', function () {
	plugins.connect.server({
		root: 'public',
		livereload: true,
		port: config.port
	});
});

gulp.task('test-connect', function () {
	plugins.connect.server({
		root: 'public',
		port: config.port + 1
	});
});

gulp.task('a11y-connect', function (callback) {
	plugins.connect.server({
		root: 'public',
		port: config.port + 3
	});
	callback();
});

gulp.task('html', function () {
	return gulp.src('./public/*.html')
		.pipe(plugins.connect.reload());
});

gulp.task('clean', function (callback) {
	return del([
		config.paths.public + '/*'
	], callback);
});

gulp.task('jshint', function (callback) {
	return gulp.src(config.globs.jshint)
		.pipe(plugins.jshint('./.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(jshintFailReporter());
});

gulp.task('sass', function () {
	return mergeStream(

		gulp.src('./node_modules/foundation-sites/scss/*.scss')
			.pipe(plugins.sass())
			.pipe(gulp.dest(config.paths.vendors + '/foundation/css')),

		gulp.src(config.globs.scss)
			.pipe(plugins.sass())
			.pipe(plugins.concat('map.css'))
			.pipe(gulp.dest(config.paths.public + '/css')),

		gulp.src(config.globs.componentsScss)
			.pipe(plugins.sass())
			.pipe(plugins.concat('components.css'))
			.pipe(gulp.dest(config.paths.public + '/components')),

		gulp.src(config.globs.widgetsScss)
			.pipe(plugins.sass())
			.pipe(gulp.dest(config.paths.public + '/widgets'))

	);
});

gulp.task('copy', function () {
	return mergeStream(

		// node_modules files to vendors
		gulp.src([
			'ractive-foundation/dist/*.js',
			'superagent/superagent.js',
			'foundation-sites/js/vendor/*.js',
			'foundation-sites/css/*.css',
			'hljs-cdn-release/build/**/*.js',
			'hljs-cdn-release/build/**/*.css'
		], { cwd: 'node_modules' })
		.pipe(plugins.copy(config.paths.vendors)),

		gulp.src([
			'ractive/*.js'
		], { cwd: 'node_modules' })
		.pipe(plugins.copy(config.paths.vendors)),

		// src-controlled vendor files to vendors
		gulp.src([
			config.globs.vendorsJs
		])
		.pipe(plugins.copy(config.paths.vendors, {prefix: 2})),

		gulp.src([
			'ractivef.initializer.js'
		], { cwd: 'node_modules/ractive-foundation/src' })
		.pipe(plugins.copy(config.paths.publicJs)),

		gulp.src([
			config.globs.componentsJson
		], { cwd: 'src' })
		.pipe(plugins.copy(config.paths.public)),

		// src files
		gulp.src([
			'js/**/*',
			'plugins/*.*',
			'core/*.js',
			'assets/**',
			'img/**/*',
			'index.html',
			'testRunner.html'
		], { cwd: 'src' })
		.pipe(plugins.copy(config.paths.public))

	);
});

gulp.task('parse-partials', function () {
	var sourcemaps = plugins.sourcemaps;

	return gulp.src(config.globs.partials)
		.pipe(sourcemaps.init())
		.pipe(ractiveParse({
			template: true,
			prefix: 'Ractive.partials',
			objectName : function(file) {
				return file.history[0].split(path.sep).slice(-1)[0].replace(/[.]hbs$/, '');
			}
		}))
		.pipe(plugins.concat('partials.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.paths.compiled));
});

gulp.task('build-templates', function () {
	var sourcemaps = plugins.sourcemaps;

	return gulp.src(config.globs.componentsHbs)
		.pipe(sourcemaps.init())
		.pipe(ractiveParse({
			template: true,
			prefix: 'Ractive.defaults.templates'
		}))
		.pipe(plugins.concat('templates.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.paths.compiled));
});

gulp.task('build-test-templates', function () {
	return gulp.src([
			'./src/components/**/use-cases/*.hbs',
			'./src/plugins/**/use-cases/*.hbs'
		])
		.pipe(ractiveParse({
			objectName: function(file) {
				var parts = file.history[0].split(path.sep).slice(-3);
				return parts[0] + '-' + parts[2].replace(/[.]hbs$/, '');
			},
			template: true,
			prefix: 'Ractive.defaults.templates'
		}))
		.pipe(plugins.concat('templates-tests.js'))
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('build-components', ['build-templates', 'build-test-templates'], function (callback) {
	var sourcemaps = plugins.sourcemaps;

	return gulp.src(config.globs.componentsJs)
		.pipe(sourcemaps.init())
		.pipe(ractiveParse({
			'prefix': 'Ractive.components'
		}))
		.pipe(plugins.concat('components.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.paths.compiled));
});

gulp.task('build-plugins', function () {
	return gulp.src([
			'./src/plugins/**/*.js',
			'!./src/plugins/**/*.steps.js'
		])
		.pipe(ractiveParse({
			'prefix': 'Ractive'
		}))
		.pipe(plugins.concat('plugins.js'))
		.pipe(gulp.dest('./public/js/'));
});

gulp.task('build-documentation', function () {

	var headerHtml = fs.readFileSync('./src/header.html'),
		footerHtml = fs.readFileSync('./src/footer.html');

	return mergeStream(

		// Component docs page.
		gulp.src(config.globs.manifests)
		.pipe(concatManifests('manifest-rf.json'))
		.pipe(gulp.dest('./public/'))
		// Create one doc file per component, using single manifest-rf.json file data.
		.pipe(renderDocumentation({
			componentsDir: config.paths.components,
			componentsDestDir: 'components/',
			docSrcPath: './src/component-page.html',
			indexSrcPath: './src/components.html',
			partials: [
				'./src/component.html',
				'./src/component-use-case.html'
			]
		}))
		.pipe(plugins.header(headerHtml, { pkg: pkg }))
		.pipe(plugins.footer(footerHtml))
		.pipe(gulp.dest('./public/')),

		// Documentation pages.
		gulp.src([ './src/pages/*.html' ])
		.pipe(plugins.header(headerHtml, { pkg: pkg }))
		.pipe(plugins.footer(footerHtml))
		.pipe(gulp.dest('./public/')),

		// Blank pages
		gulp.src([ './src/blank-pages/*.html' ])
			.pipe(gulp.dest('./public/')),

		// Test runner while we're at it.
		gulp.src('./src/testRunner.html')
			.pipe(gulp.dest('./public/'))

	);

});

gulp.task('server', function (callback) {
	var isStarted = false;

	// Q's promise API is resolve, reject, notify. liveServer uses notify for
	// console.log statements in server.js.
	liveServer.start().then(function () {}, function () {}, function () {

		if (!isStarted) {

			// Only run this code once.
			// Any time the server logs stuff, this function is executed.
			isStarted = true;

			// Restart if server.js itself is changed.
			gulp.watch('server.js', liveServer.start);

			callback();

		}
	});
});

gulp.task('open', function () {
	var options = {
		url: 'http://localhost:' + config.port
	};

	// A file must be specified as the src when running options.url
	// or gulp will overlook the task. So I'm just using a dummmy file here.
	// First arg is empty string,
	return gulp.src('./gulpfile.js')
		.pipe(plugins.open('', options));
});

gulp.task('a11y-only', [ 'a11y-connect' ], function (callback) {

	rfA11y.auditComponents({ port: config.port + 2 })
		.then(function () {
			callback();
			process.exit(0);
		})
		.catch(function (error) {
			callback(new Error(error));
			process.exit(1);
		});

});

gulp.task('build', ['clean'], function (callback) {
	runSequence([
		'sass',
		'build-templates',
		'build-test-templates',
		'build-plugins',
		'parse-partials',
		'build-components',
		'build-documentation'
	], [
		'copy'
	], callback);
});

gulp.task('unit-test', function () {
	return gulp.src('./test/**.js', { read: false })
		.pipe(plugins.mocha({reporter: 'nyan'}));
});

gulp.task('bdd-test', function () {

	// Run test suite for each widget individually, sandboxing the options.
	return gulp.src(config.globs.widgetsFeatures, { read: false })
		.pipe(plugins.foreach(function (stream, file) {

			var widgetName = path.parse(file.path).name;

			console.log('############################# widgetName:', widgetName);

			return stream
				.pipe(plugins.cucumber({
					steps: config.paths.widgets + widgetName + '/tests/' + widgetName + '.steps.js',
					format: 'pretty'
				}));

		}));
});

gulp.task('watch', function () {
	var self = this;
	plugins.watch([
		'src/*.html',
		'src/pages/*.html',
		'src/blank-pages/*.html',
		'src/**/*.json',
		'src/**/*.hbs',
		'src/**/*.md',
		'src/**/*.js',
		'src/**/*.scss'
	], function () {
		runSequence('build', 'html', function (err) {
			self.emit('end');
		});
	});
});

gulp.task('a11y-only', [ 'a11y-connect' ], function (callback) {

	rfA11y.auditComponents({ port: A11Y_SERVER_PORT })
		.then(function () {
			callback();
			process.exit(0);
		})
		.catch(function (error) {
			callback(new Error(error));
			process.exit(1);
		});

});

// Run the test suite alone, without re-building the project. Useful for rapid test debugging.
// See 'test' for the full build and test task.
gulp.task('test-only', [ 'test-connect' ], function (callback) {

	var selServer = seleniumServer(),
		globFeature = [],
		globStep = [],
		options = {},
		componentName  = options.component || '',
		paths = [];

	if (options.component) {

		paths = [
			'./src/components/%s/*.feature'.replace('%s', componentName)
		];

		globFeature = glob(paths);

		if (!globFeature.length) {
			gutil.log(gutil.colors.red.bold('Couldn\'t find requested component/widget, running whole suite'));
		}
	}
	if (options.plugin) {

		var pluginName = options.plugin || '';

		var paths = [
			'./src/plugins/%s/*.feature'.replace('%s', pluginName)
		];

		globFeature = glob(paths);

		if (!globFeature.length) {
			gutil.log(gutil.colors.red.bold('Couldn\'t find requested component/widget, running whole suite'));
		}
	}

	if (!globFeature.length) {

		paths = [
			'./src/components/**/*.feature',
			'./src/plugins/**/*.feature'
		];

		globFeature = glob(paths);
	}

	globStep = [
		'./src/components/**/*.steps.js',
		'./src/plugins/**/*.steps.js'
	];

	selServer.init().then(function () {
		var stream = gulp.src(globFeature)
			.pipe(rfCucumber(
				{ steps: globStep }
			));

		stream.on('end', function () {
			selServer.killServer().then(function () {
				callback();
				process.exit(0);
			}).catch(function () {
				callback();
				process.exit(0);
			});
		});

		stream.on('error', function (err) {
			var errorCode = err ? 1 : 0;
			selServer.killServer().then(function () {
				callback(err);
				process.exit(errorCode);
			}).catch(function () {
				callback(err);
				process.exit(errorCode);
			});
		});
	}).catch(gutil.log);
});

// Build and test the project. Default choice. Used by npm test.
gulp.task('test', function (callback) {
	runSequence([ 'build' ], 'test-only', callback);
});

// Currently a11y not part of standard build/test process.
gulp.task('a11y', function (callback) {
	runSequence([ 'build' ], 'a11y-only', callback);
});

gulp.task('lint', function (callback) {
	return gulp.src('./src/**/*.js')
		.pipe(plugins.jshint('./.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jshintFailReporter());
});

gulp.task('default', function () {
	var self = this;
	runSequence('unit-test', 'build', 'connect', 'watch', function (err) {
		self.emit('end');
	});
});
