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
      ,
      {
      type: 'list',
      name: 'preprocessor',
      choices :[{name:'(none)',value:''},'less','scss'],
      message: 'Would you like to use a style pre-processor?',
      default: ''
      }
      ,
      {
      type: 'checkbox',
      name: 'templating',
      choices :['strings.json','templates/'],
      message: 'Which sort of templating would you like to use?',
      default: [true, true]
      }
      ,
      {
      type: 'confirm',
      name: 'babel',
      message: 'Would you like to use es6?',
      default: true
      }
      ,
      {
      type: 'confirm',
      name: 'push',
      message: 'Would like to host your project to optimizely with gulp?',
      default: true
      }
      ,
      {
      type: 'confirm',
      name: 'host',
      message: 'Would like to host your project locally with gulp?\n(Requires local installation of localghost with \'npm install -g localghost\'',
      default: true
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
      props.template = props.templating[0] ||"";
      props.template1 = props.templating[1] ||"";
      delete props.templating;
      this.fs.copyTpl(//Create package.json
        this.templatePath('_package.json'),
        this.destinationPath(props.name + '/package.json'),
        props
      )

      this.fs.copyTpl(//Create gulpfile.js
        this.templatePath('_gulpfile.js'),
        this.destinationPath(props.name + '/gulpfile.js'),
        props
      )

      this.fs.copyTpl(//Create experiment.json
        this.templatePath('_experiment.json'),
        this.destinationPath(props.name + '/output/experiment.json'),
        props
      )

      this.fs.copyTpl(//Create global.js
        this.templatePath('_empty'),
        this.destinationPath(props.name + '/input/global.js'),
        props
      )


      this.fs.copyTpl(//Create global.css/scss/less
        this.templatePath('_empty'),
        this.destinationPath(props.name + '/input/global.' + (props.preprocessor || 'css')),
        props
      )

      if(props.template){//Create strings.js
        this.fs.copyTpl(
          this.templatePath('_strings.json'),
          this.destinationPath(props.name + '/input/strings.json'),
          props
        )
      }

      if(props.template1){//Create templates folder
        this.fs.copyTpl(
          this.templatePath('_empty'),
          this.destinationPath(props.name + '/input/templates/.gitkeep'),
          props
        )
      }
    }
  },

  install: function () {
    console.log('Don\'t forget to run "npm install" in your experiment directory')
  }
});
