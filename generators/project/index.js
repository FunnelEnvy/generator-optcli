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
      'Let\'s create an ' + chalk.blue('Optimizely Project') + '... Funnelenvy Style!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Name your project folder',
      },
      {
        type: 'input',
        name: 'id',
        message: 'What\'s your projects\'s ID?',
      },
      {
        type: 'password',
        name: 'token',
        message: 'What\'s your API \'s token? (Copy + Paste -- Will not be shown.)',
      },
      {
        type: 'confirm',
        name: 'include_jquery',
        message: 'Include jQuery?',
        default:true,
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
      this.fs.copyTpl(//Create gulpfile.js
        this.templatePath('_token'),
        this.destinationPath(props.name + '/.optcli/token'),
        props
      );
      this.fs.copyTpl(//Create gulpfile.js
        this.templatePath('_project.json'),
        this.destinationPath(props.name + '/project.json'),
        props
      );
    },
    projectfiles: function () {
      var props = this.props;
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath(props.name + '/.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath(props.name + '/.jshintrc')
      );
    }
  }
});
