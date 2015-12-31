'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	paths: {
		base      : './src',
		components: './src/components/',
		partials  : './src/partials/',

		public         : './public',
		publicJs       : './public/js',
		vendors        : './public/vendors',
		compiled       : './public/compiled'
	},

	globs: {
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
			'./generator/**/*.js',
			'./tasks/**/*.js',
			'./test/**/*.js',
			'./tests/**/*.js',
			'./server.js',
			'./gulpfile.js',
			'!src/plugins/ractiveTap.js'
		],
		vendorsJs: './src/vendors/**/*.js',
		testTemplates: [
			'./src/components/**/use-cases/*.hbs',
			'./src/plugins/**/use-cases/*.hbs',
			'./node_modules/ractive-foundationsrc/components/**/use-cases/*.hbs',
			'./node_modules/ractive-foundationsrc/plugins/**/use-cases/*.hbs'
		]
	},
	menu: {
		expandedState: '',
		leftItems: [
			{
				label: 'Learn More'
			},
			{
				href: '.',
				label: 'Home'
			},
			{
				href: 'components.html',
				label: 'Components'
			},
			{
				href: 'data.html',
				label: 'Data'
			},
			{
				href: 'demo.html',
				label: 'Demo'
			},
			{
				label: 'External Links'
			},
			{
				href: 'http://foundation.zurb.com/docs/',
				label: 'Foundation docs',
				target: '_blank'
			},
			{
				href: 'http://docs.ractivejs.org/latest/get-started',
				label: 'RactiveJS docs',
				target: '_blank'
			}
		]
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
					appname: this.config.get('appname') || this.appname,
					pkg: {
						version: '<%= pkg.version %>',
						name: '<%= pkg.name %>'
					}
				};

			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				data
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
			this.fs.copyTpl(
				this.templatePath('component-page.html'),
				this.destinationPath('src/component-page.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('component-use-case.html'),
				this.destinationPath('src/component-use-case.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('component.html'),
				this.destinationPath('src/component.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('components.html'),
				this.destinationPath('src/components.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('footer.html'),
				this.destinationPath('src/footer.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('header.html'),
				this.destinationPath('src/header.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('route.js'),
				this.destinationPath('src/js/route.js'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('steps.js'),
				this.destinationPath('src/support/steps.js'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('testRunner.html'),
				this.destinationPath('src/testRunner.html'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('world.js'),
				this.destinationPath('src/world.js'),
				data
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
		if (!this.config.get('appname')) {
			this.config.set('appname', this.appname);
		}
		if (!this.config.get('paths')) {
			this.config.set('paths', this.paths);
		}
		if (!this.config.get('globs')) {
			this.config.set('globs', this.globs);
		}
		if (!this.config.get('port')) {
			this.config.set('port', this.port);
		}
		if (!this.config.get('menu')) {
			this.config.set('menu', this.menu);
		}

		this.installDependencies();
	}
});
