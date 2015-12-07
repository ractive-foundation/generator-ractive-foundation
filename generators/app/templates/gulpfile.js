var fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	plugins = require('gulp-load-plugins')(),
	del = require('del'),
	glob = require('glob'),
	path = require('path'),
	mergeStream = require('merge-stream'),
	runSequence = require('run-sequence'),
	jshintFailReporter = require('./node_modules/ractive-foundation/tasks/jshintFailReporter'),
	ractiveParse = require('./node_modules/ractive-foundation/tasks/ractiveParse');

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

// Alias "build" task, which does most of the work.
gulp.task('build', function (callback) {
	runSequence(
		'clean', 'jshint',
		[ 'parse-partials', 'concat-components', 'sass' ],
		[ 'copy' ],
		callback
	);
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
			'ractive-foundation/dist/*.js'
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
			'*.html'
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

gulp.task('concat-components', ['build-templates'], function (callback) {
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

gulp.task('test', ['unit-test', 'bdd-test']);

gulp.task('watch', function () {

	// See https://www.npmjs.com/package/gulp-watch
	var watchOptions =  {
		read: false
	};

	// Glob files before hand, as watch doesn't accept ignores.
	var watchFiles = glob.sync('{' + (config.globs.srcBuild || []).join(',') + '}',
		{ ignore: config.globs.srcBuildIgnore });

	// Watch everything including SASS, and trigger the entire build.
	// TODO Split this up further, as we notice recompile speed issues. Gotta keep it fast.
	// Some issues with adding/removing widgets/components, and triggering separate watch tasks.
	// sass seems to error when not run in parallel.
	plugins.watch(watchFiles, watchOptions, plugins.batch(function (events, cb) {

		var latestFile;

		events.on('data', function (file) {
			latestFile = file;
			gutil.log('watch: source changed file:', file.path);
		});

		events.on('end', function () {
			runSequence('build', 'unit-test', function (err) {
				gutil.log('watch: source finished.');
				liveServer.notify(latestFile);
				cb();
			});
		});

	}));
});

gulp.task('default', function () {
	var self = this;
	runSequence('unit-test', 'build', 'server', 'watch', function (err) {
		self.emit('end');
	});
});
