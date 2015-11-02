var fs = require('fs'),
	gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	del = require('del'),
	path = require('path'),
	mergeStream = require('merge-stream'),
	runSequence = require('run-sequence'),
	jshintFailReporter = require('./node_modules/ractive-foundation/tasks/jshintFailReporter'),
	ractiveParse = require('./node_modules/ractive-foundation/tasks/ractiveParse');

// All config information is stored in the .yo-rc.json file so that yeoman can
// also get to this information
var config = JSON.parse(fs.readFileSync('./.yo-rc.json'))['generator-ractive-foundation'];

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
		], { cwd: 'node_modules/ractive-foundation/node_modules' })
		.pipe(plugins.copy(config.paths.vendors)),

		// src-controlled vendor files to vendors
		gulp.src([
			config.globs.vendorsJs
		])
		.pipe(plugins.copy(config.paths.vendors, {prefix: 2})),

		// src files
		gulp.src([
			'js/*.js',
			'plugins/*.*',
			'core/*.js',
			'assets/**',
			'index.html'
		], { cwd: 'src' })
		.pipe(plugins.copy(config.paths.public))

	);
});

gulp.task('parse-partials', function () {
	return gulp.src(config.globs.partials)
		.pipe(ractiveParse({
			prefix: 'Ractive.partials',
			name : function(file) {
				return file.history[0].split(path.sep).slice(-1)[0].replace(/[.]hbs$/, '');
			}
		}))
		.pipe(plugins.concat('partials.js'))
		.pipe(gulp.dest(config.paths.compiled));
});

gulp.task('concat-components', function (callback) {
	var strip = require('gulp-strip-comments');
	var wrap = require('gulp-wrap-amd');
	return gulp.src(config.globs.componentsJs)
		.pipe(ractiveParse({
			'prefix': 'Ractive.components'
		}))
		.pipe(strip())
		.pipe(plugins.concat('components.js'))
		.pipe(wrap({
			deps: ['Ractive'],
			params: ['Ractive', 'components'],
			exports: 'Ractive.components'
		}))
		.pipe(gulp.dest(config.paths.compiled));
});

gulp.task('server', function (callback) {
	var isStarted = false;
	var gls = plugins.liveServer.new('server.js');

	// Q's promise API is resolve, reject, notify. gls uses notify for
	// console.log statements in server.js.
	gls.start().then(function () {}, function () {}, function () {

		if (!isStarted) {

			// Only run this code once.
			// Any time the server logs stuff, this function is executed.
			isStarted = true;

			// live reload changed resource(s).
			gulp.watch('public/**/*', gls.notify);

			// Restart if server.js itself is changed.
			gulp.watch('server.js', gls.start);

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

	var self = this;

	// TODO Watch more than just javascript, do more than just jshint.
	plugins.watch(config.globs.srcJavaScript, function () {
		runSequence('build', 'test', function (err) {
			self.emit('end');
		});
	});
});

gulp.task('default', function () {
	var self = this;
	runSequence('unit-test', 'build', 'server', 'open', 'watch', function (err) {
		self.emit('end');
	});
});
