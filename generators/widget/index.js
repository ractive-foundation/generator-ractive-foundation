'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	templates: {
		'{templatePath}/wingComponent.scss'            : 'stylesheets/{widgetName}.scss',
		'{templatePath}/use-cases/customAtributes.json': 'use-cases/customAtributes.json',
		'{templatePath}/use-cases/dataDriven.json'     : 'use-cases/dataDriven.json',
		'{templatePath}/use-cases/templateDriven.json' : 'use-cases/templateDriven.json',
		'{templatePath}/use-cases/templateDriven.hbs'  : 'use-cases/templateDriven.hbs',
		'{templatePath}/manifest.json'                 : 'manifest.json',
		'{templatePath}/wingComponent.hbs'             : 'hbs/{widgetName}.hbs',
		'{templatePath}/README.md'                     : 'README.md',
		'{templatePath}/wingComponent.js'              : 'javascript/{widgetName}.js',
		'{templatePath}/wingComponent.feature'         : 'test/{widgetName}.feature',
		'{templatePath}/wingComponent.steps.js'        : 'test/{widgetName}.steps.js'
	},

	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		this.argument('widgetName', { type: String, required: false });
		this.option('quiet');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		if (!this.options.quiet) {
			this.log(yosay(
				'Welcome to the ' + chalk.green('ractive-foundation') + ' ' + chalk.red('widget') + ' generator'
			));
		}

		if (this.arguments.length) {
			this.widgetName = this.arguments[0];
		}

		if (!this.widgetName) {
			var prompts = [{
				type: 'text',
				name: 'widgetName',
				message: 'Name of the widget?'
			}];

			this.prompt(prompts, function (props) {
				this.props = props;
				// To access props later use this.props.someOption;

				this.widgetName = props.widgetName;
				done();
			}.bind(this));
		}
		else {
			this.props = {
				widgetName: this.widgetName
			};
			done();
		}
	},

	writing: {
		app: function () {
			var widgetDir  = this.config.get('paths').widgets,
				widgetName = this.widgetName,
				templatePath  = this.sourceRoot(),
				basePath      = widgetDir + '/' + widgetName + '/';

			for (var template in this.templates) {
				var dest = this.templates[template];
				template = template.replace(/[{]templatePath[}]/g, templatePath);
				template = template.replace(/[{]widgetName[}]/g, widgetName);
				dest = dest.replace(/[{]widgetName[}]/g, widgetName);

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
