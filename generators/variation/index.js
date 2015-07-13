'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var funnelenvysays = require('funnelenvysays');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(funnelenvysays(
      'Let\'s create an ' + chalk.blue('Optimizely Variation') + '... Funnelenvy Style!'
    ));

    var prompts = [
      {
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your variation?\nThis will be your description\'s folder name.',
      default: 'DefaultVariation'
      },
      {
      type: 'input',
      name: 'description',
      message: 'What\'s the description of your variation?',
      default: 'Default Variation'
      }
      ,
      {
      type: 'input',
      name: 'id',
      message: 'What\'s your variations\'s ID? (Leave blank if not yet created.)',
      }
      ,
      {
      type: 'confirm',
      name: 'taskrunner',
      message: 'Do you plan on using a task runner?',
      default: false
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
      var experiment = path.resolve("experiment.json");
      props.experiment = experiment;
      this.fs.copyTpl(//Create variation.json file
        this.templatePath('_variation.json'),
        this.destinationPath(props.name + '/variation.json'),
        props
      );
      this.fs.copyTpl(//Create gulpfile.js
        this.templatePath('_empty'),
        this.destinationPath(props.name + '/variation.js'),
        props
      );
      if(props.taskrunner){
        this.fs.copyTpl(//Create empty incudes folder
          this.templatePath('_empty'),
          this.destinationPath(props.name + '/_/includes/.gitkeep'),
          props
        );
        this.fs.copyTpl(//Create gulpfile.js
          this.templatePath('_empty'),
          this.destinationPath(props.name + '/_/variation.js'),
          props
        );
      }
    }
  }
});
