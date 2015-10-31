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
		componentsJs  : [
			'./src/components/**/*.js',
			'!./src/components/**/*.steps.js'
		],
		srcJavaScript: [
			'./src/core/**/*.js',
			'./src/plugins/**/*.js',
			'./src/support/**/*.js',
			'./src/widgets/**/*.js',
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

	prompting: function () {

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the ' + chalk.red('Ractive-Foundation') + ' project generator!'
		));
		this.log('Next steps: create components/widgets/decorators/transition/events');
	},

	writing: {
		app: function () {
			this.fs.copy(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
			);
			this.fs.copy(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json')
			);
			this.fs.copy(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/components/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/partials/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/widgets/.gitignore')
			);
			this.fs.copy(
				this.templatePath('.gitignore'),
				this.destinationPath('src/plugins/.gitignore')
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

		this.composeWith('ractive-foundation:widget', {args: ['default', '--quiet']});

		this.installDependencies();
	}
});
