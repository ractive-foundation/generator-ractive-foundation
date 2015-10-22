'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the grand ' + chalk.red('GeneratorRactiveFoundation') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'componentDir',
      message: 'Directory to store components?',
      default: 'src/components'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath(this.props.componentDir + '/bower.json')
      );
    },
  },

  install: function () {
    //this.installDependencies();
  }
});
