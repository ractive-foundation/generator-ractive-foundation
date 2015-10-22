'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the grand ' + chalk.red('RF component') + ' generator!'
		));

		var prompts = [{
			type: 'text',
			name: 'componentDir',
			message: 'Directory to store components?',
			default: 'src/components'
		}, {
			type: 'text',
			name: 'componentName',
			message: 'Name of the component?'
		}];

		this.prompt(prompts, function (props) {
			this.props = props;
			// To access props later use this.props.someOption;

			done();
		}.bind(this));
	},

	writing: {
		app: function () {
			var componentDir  = this.props.componentDir,
				componentName = this.props.componentName,
				basePath      = componentDir + '/' + componentName + '/';

			this.fs.copy(
				this.templatePath('wingComponent.scss'),
				this.destinationPath(basePath + componentName + '.scss')
			);
			this.fs.copy(
				this.templatePath('use-cases/customAtributes.json'),
				this.destinationPath(basePath + 'use-cases/customAtributes.json')
			);
			this.fs.copy(
				this.templatePath('use-cases/dataDriven.json'),
				this.destinationPath(basePath + 'use-cases/dataDriven.json')
			);
			this.fs.copy(
				this.templatePath('manifest.json'),
				this.destinationPath(basePath + 'manifest.json')
			);
			this.fs.copy(
				this.templatePath('wingComponent.hbs'),
				this.destinationPath(basePath + componentName + '.hbs')
			);
			this.fs.copy(
				this.templatePath('README.md'),
				this.destinationPath(basePath + 'README.md')
			);
			this.fs.copy(
				this.templatePath('wingComponent.js'),
				this.destinationPath(basePath + componentName + '.js')
			);
			this.fs.copy(
				this.templatePath('wingComponent.feature'),
				this.destinationPath(basePath + componentName + '.feature')
			);
			this.fs.copy(
				this.templatePath('wingComponent.steps.js'),
				this.destinationPath(basePath + componentName + '.steps.js')
			);
		},
	},

	install: function () {
		//this.installDependencies();
	}
});
