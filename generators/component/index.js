'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	templates: {
		'{templatePath}/manifest.json'                 : { simple: true,  file: 'manifest.json' },
		'{templatePath}/wingComponent.hbs'             : { simple: true,  file: '{componentName}.hbs' },
		'{templatePath}/wingComponent.js'              : { simple: true,  file: '{componentName}.js' },
		'{templatePath}/wingComponent.scss'            : { simple: true,  file: '{componentName}.scss' },
		'{templatePath}/README.md'                     : { simple: false, file: 'README.md' },
		'{templatePath}/wingComponent.feature'         : { simple: false, file: '{componentName}.feature' },
		'{templatePath}/wingComponent.steps.js'        : { simple: false, file: '{componentName}.steps.js' },
		'{templatePath}/use-cases/customAtributes.json': { simple: false, file: 'use-cases/customAtributes.json' },
		'{templatePath}/use-cases/dataDriven.json'     : { simple: false, file: 'use-cases/dataDriven.json' },
		'{templatePath}/use-cases/templateDriven.json' : { simple: false, file: 'use-cases/templateDriven.json' },
		'{templatePath}/use-cases/templateDriven.hbs'  : { simple: false, file: 'use-cases/templateDriven.hbs' }
	},

	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		this.argument('componentName', { type: String, required: false });

		this.option('simple', { alias: 's' });
		this.option('parent', { alias: 'p', type: 'String' });
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
				parent        = this.options.parent,
				basePath      = parent ? componentDir + '/' + parent + '/components/' + componentName : componentDir + '/' + componentName + '/';
				this.props.appname = this.config.get('appname');
				this.props.parent  = parent ? '.components[\'' + parent + '\']' : '';
				this.props.pkg = {
					version: '<%= pkg.version %>',
					name: this.config.get('appname')
				};

			for (var template in this.templates) {
				if (!this.options.simple || this.templates[template].simple) {
					var dest = this.templates[template].file;
					template = template.replace(/[{]templatePath[}]/g, templatePath);
					template = template.replace(/[{]componentName[}]/g, componentName);
					dest = dest.replace(/[{]componentName[}]/g, componentName);

					this.fs.copyTpl(
						template,
						this.destinationPath(basePath + '/' + dest),
						this.props
					);
				}
			}
		},
	},

	install: function () {
		//this.installDependencies();
	}
});
