'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	templates: {
		'{templatePath}/wingComponent.scss'            : '{componentName}.scss',
		'{templatePath}/use-cases/customAtributes.json': 'use-cases/customAtributes.json',
		'{templatePath}/use-cases/dataDriven.json'     : 'use-cases/dataDriven.json',
		'{templatePath}/use-cases/templateDriven.json' : 'use-cases/templateDriven.json',
		'{templatePath}/use-cases/templateDriven.hbs'  : 'use-cases/templateDriven.hbs',
		'{templatePath}/manifest.json'                 : 'manifest.json',
		'{templatePath}/wingComponent.hbs'             : '{componentName}.hbs',
		'{templatePath}/README.md'                     : 'README.md',
		'{templatePath}/wingComponent.js'              : '{componentName}.js',
		'{templatePath}/wingComponent.feature'         : '{componentName}.feature',
		'{templatePath}/wingComponent.steps.js'        : '{componentName}.steps.js'

	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		this.argument('componentName', { type: String, required: false });
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the ' + chalk.green('ractive-foundation') + ' ' + chalk.red('component') + ' generator'
		));

		if (this.arguments.length) {
			this.componentName = this.arguments[0];
		}

		if (!this.componentName) {
			var prompts = [{
				type: 'text',
				name: 'componentName',
				message: 'Name of the component?'
			}];

			this.prompt(prompts, function (props) {
				this.props = props;
				// To access props later use this.props.someOption;

				this.componentName = props.componentName;
				done();
			}.bind(this));
		}
		else {
			this.props = {
				componentName: this.componentName
			};
			done();
		}
	},

	writing: {
		app: function () {
			var componentDir  = this.config.get('paths').components,
				componentName = this.componentName,
				templatePath  = this.sourceRoot(),
				basePath      = componentDir + '/' + componentName + '/';

			for (var template in this.templates) {
				var dest = this.templates[template];
				template = template.replace(/[{]templatePath[}]/g, templatePath);
				template = template.replace(/[{]componentName[}]/g, componentName);
				dest = dest.replace(/[{]componentName[}]/g, componentName);

				this.fs.copyTpl(
					template,
					this.destinationPath(basePath + '/' + dest),
					this.props
				);
			}
		},
	},

	install: function () {
		//this.installDependencies();
	}
});
