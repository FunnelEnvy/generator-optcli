'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Let\'s create an ' + chalk.blue('Optimizely Experiment') + '... Funnelenvy Style!'
    ));

    var prompts = [
      {
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your experiment',
      default: 'Default Experiment'
      },
      {
      type: 'input',
      name: 'description',
      message: 'What\'s the your experiment\'s description',
      default: 'Default Experiment'
      }
      ,
      {
      type: 'input',
      name: 'url',
      message: 'What\'s your experiments edit URL?',
      default: 'http://www.funnelenvy.com'
      }
      ,
      {
      type: 'input',
      name: 'id',
      message: 'What\'s your experiment\'s ID? (Leave blank if not yet created.)',
      default: ''
      }
    ];
    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var props = this.props;

      this.fs.copyTpl(//Create experiment.json
        this.templatePath('_experiment.json'),
        this.destinationPath(props.name + '/experiment.json'),
        props
      )
      this.fs.copyTpl(//Create global.js
        this.templatePath('_empty'),
        this.destinationPath(props.name + '/global.js'),
        props
      )
      this.fs.copyTpl(//Create global.css
        this.templatePath('_empty'),
        this.destinationPath(props.name + '/global.css'),
        props
      )
    }
  },

  install: function () {
    console.log('Don\'t forget to run "npm install" in your directory')
  }
});
