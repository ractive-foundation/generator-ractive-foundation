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

			this.fs.copyTpl(
				this.templatePath('wingComponent.scss'),
				this.destinationPath(basePath + componentName + '.scss'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('use-cases/customAtributes.json'),
				this.destinationPath(basePath + 'use-cases/customAtributes.json'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('use-cases/dataDriven.json'),
				this.destinationPath(basePath + 'use-cases/dataDriven.json'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('manifest.json'),
				this.destinationPath(basePath + 'manifest.json'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('wingComponent.hbs'),
				this.destinationPath(basePath + componentName + '.hbs'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('README.md'),
				this.destinationPath(basePath + 'README.md'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('wingComponent.js'),
				this.destinationPath(basePath + componentName + '.js'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('wingComponent.feature'),
				this.destinationPath(basePath + componentName + '.feature'),
				this.props
			);
			this.fs.copyTpl(
				this.templatePath('wingComponent.steps.js'),
				this.destinationPath(basePath + componentName + '.steps.js'),
				this.props
			);
		},
	},

	install: function () {
		//this.installDependencies();
	}
});
