'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	paths: {
		base      : './src',
		components: './src/components/',
		widgets   : './src/widgets/',
		partials  : './src/partials/',

		public         : './public',
		vendors        : './public/vendors',
		compiled       : './public/compiled',
		compiledWidgets: './public/compiled/widgets',
	},

	globs: {
		tests         : './src/widgets/**/tests/*.*',
		partials      : './src/partials/**/*.hbs',
		componentsScss: './src/components/**/*.scss',
		scss: './src/scss/*.scss',
		templates: './src/*.html',
		componentsJs  : [
			'./src/components/**/*.js',
			'!./src/components/**/*.steps.js'
		],
		componentsHbs: [
			'./src/components/**/*.hbs',
			'!./src/components/**/use-cases/*.hbs'
		],
		componentsJson: 'components/**/use-cases/*.json',
		manifests: [
			'./src/components/**/manifest.json',
			'./node_modules/ractive-foundation/src/components/**/manifest.json'
		],
		srcJavaScript: [
			'./src/core/**/*.js',
			'./src/plugins/**/*.js',
			'./src/support/**/*.js',
			'./src/widgets/**/*.js',
			'./src/components/**/*.js',
			'./src/js/**/*.js',
			'./generator/**/*.js',
			'./tasks/**/*.js',
			'./test/**/*.js',
			'./tests/**/*.js',
			'./server.js',
			'./gulpfile.js'
		],
		jshint: [
			'./src/core/**/*.js',
			'./src/plugins/**/*.js',
			'./src/support/**/*.js',
			'./src/widgets/**/*.js',
			'./generator/**/*.js',
			'./tasks/**/*.js',
			'./test/**/*.js',
			'./tests/**/*.js',
			'./server.js',
			'./gulpfile.js',
			'!src/plugins/ractiveTap.js'
		],
		vendorsJs      : './src/vendors/**/*.js',
		widgets        : './src/widgets/**/*.*',
		widgetsJs      : './src/widgets/**/javascript/*.js',
		widgetsScss    : './src/widgets/**/stylesheets/*.scss',
		widgetsTpl     : './src/widgets/**/hbs/*.hbs',
		widgetsFeatures: './src/widgets/**/test/*.feature'
	},

	// create a random port number for app to use
	// numbers will be in the range 2000-9999, 10000-59999
	port: (Math.random() + '').match(/[1-5]\d{4}|[2-9]\d{3}/)[0] * 1,

	prompting: function () {

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the ' + chalk.red('Ractive-Foundation') + ' project generator!'
		));
		this.log('Next steps: create components/widgets/decorators/transition/events');
	},

	writing: {
		app: function () {
			var port = this.config.get('port') || this.port,
				data = {
					port: port,
					appname: this.appname
				};

			this.fs.copy(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
			);
			this.fs.copy(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json')
			);
			this.fs.copyTpl(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js'),
				data
			);
			this.fs.copy(
				this.templatePath('index.js'),
				this.destinationPath('src/js/index.js')
			);
			this.fs.copyTpl(
				this.templatePath('index.html'),
				this.destinationPath('src/index.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('server.js'),
				this.destinationPath('server.js'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('README.md'),
				this.destinationPath('README.md'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('base.hbs'),
				this.destinationPath('src/partials/base.hbs'),
				data
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/components/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/widgets/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/plugins/.gitignore')
			);
			this.fs.copy(
				this.templatePath('component-page.html'),
				this.destinationPath('src/component-page.html')
			);
			this.fs.copy(
				this.templatePath('component-use-case.html'),
				this.destinationPath('src/component-use-case.html')
			);
			this.fs.copy(
				this.templatePath('component.html'),
				this.destinationPath('src/component.html')
			);
			this.fs.copy(
				this.templatePath('components.html'),
				this.destinationPath('src/components.html')
			);
			this.fs.copy(
				this.templatePath('footer.html'),
				this.destinationPath('src/footer.html')
			);
			this.fs.copy(
				this.templatePath('header.html'),
				this.destinationPath('src/header.html')
			);
			this.fs.copy(
				this.templatePath('steps.js'),
				this.destinationPath('src/support/steps.js')
			);
		},

		projectfiles: function () {
			this.fs.copy(
				this.templatePath('editorconfig'),
				this.destinationPath('.editorconfig')
			);
			this.fs.copy(
				this.templatePath('jshintrc'),
				this.destinationPath('.jshintrc')
			);
		}
	},

	install: function () {
		if (!this.config.get('paths')) {
			this.config.set('paths', this.paths);
		}
		if (!this.config.get('globs')) {
			this.config.set('globs', this.globs);
		}
		if (!this.config.get('port')) {
			this.config.set('port', this.port);
		}

		this.installDependencies();
	}
});
