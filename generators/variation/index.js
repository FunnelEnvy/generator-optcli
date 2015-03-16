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
      'Let\'s create an ' + chalk.blue('Optimizely Variation') + '... Funnelenvy Style!'
    ));

    var prompts = [
      {
      type: 'input',
      name: 'description',
      message: 'What\'s the name of your variation?',
      default: 'Default Variation'
      }
      ,
      {
      type: 'input',
      name: 'id',
      message: 'What\'s your variations\'s ID? (Leave blank if not yet created.)',
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
        this.templatePath('_variation.json'),
        this.destinationPath(props.description + '/variation.json'),
        props
      );
      this.fs.copyTpl(//Create gulpfile.js
        this.templatePath('_empty'),
        this.destinationPath(props.description + '/variation.js'),
        props
      );
    }
  }
});
