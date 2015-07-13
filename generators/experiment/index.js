'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var funnelenvysays = require('funnelenvysays');
var taskRunnnerSelected = function(props){
  return !!props.taskrunner;
};
module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },
  prompting: function () {
    var done = this.async();
    // Have Funnel Envy greet the user.
    this.log(funnelenvysays(
      'Let\'s create an ' + chalk.blue('Optimizely Experiment') + '... Funnelenvy Style!'
    ));
    var prompts = [
      {
      type: 'input',
      name: 'name',
      message: 'What\'s the name of your experiment',
      default: 'DefaultExperiment'
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
        name: 'taskrunner',
        choices :[{name:'(none)',value:''}, 'gulp'],
        message: 'Would you like to use a task runner?',
        default: ''
      }
      ,
      {
      type: 'list',
      name: 'preprocessor',
      choices :[{name:'(none)',value:''},'less','scss'],
      message: 'Would you like to use a style pre-processor?',
      default: ''
      ,
      when : taskRunnnerSelected
      }
      ,
      {
      type: 'confirm',
      name: 'templating',
      message: 'Would you like to use templating?',
      default: true,
      when : taskRunnnerSelected
      }
      ,
      {
      type: 'confirm',
      name: 'assets',
      message: 'Would you like to include an assets folder?',
      default: true,
      when : taskRunnnerSelected
      }
      ,
      {
      type: 'confirm',
      name: 'includes',
      message: 'Would you like to use javascript includes?',
      default: true,
      when : taskRunnnerSelected
      }
      ,
      {
      type: 'confirm',
      name: 'push',
      message: 'Would like to push your experiment to optimizely?',
      default: true,
      when : taskRunnnerSelected
      }
      ,
      {
      type: 'confirm',
      name: 'host',
      message: 'Would like to host your project locally?\n',
      default: true,
      when : taskRunnnerSelected
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
      this.fs.copyTpl(//Create global.js
        this.templatePath('_readme.md'),
        this.destinationPath(props.name + '/readme.md'),
        props
      )
      this.fs.copyTpl(//Create experiment.json
        this.templatePath('_experiment.json'),
        this.destinationPath(props.name + '/experiment.json'),
        props
      )
      this.fs.copyTpl(//Create global.js
        this.templatePath('_global.js'),
        this.destinationPath(props.name + '/global.js'),
        props
      )
      this.fs.copyTpl(//Create global.css/scss/less
        this.templatePath('_global.css'),
        this.destinationPath(props.name + '/global.css'),
        props
      )
      ////////
      if(props.taskrunner){
        switch(props.taskrunner){
          case 'brocoli':
            break;
          case 'grunt':
            break;
          case 'gulp':
          default:
            this.fs.copyTpl(
              this.templatePath('_package.json'),
              this.destinationPath(props.name + '/package.json'),
              props
            )
            this.fs.copyTpl(//Create gulpfile.js
              this.templatePath('_gulpfile.js'),
              this.destinationPath(props.name + '/gulpfile.js'),
              props
            )
            this.fs.copyTpl(//Create global.js
              this.templatePath('_eslint'),
              this.destinationPath(props.name + '/.eslint'),
              props
            )
            this.fs.copyTpl(//Create global.js
              this.templatePath('_global.js'),
              this.destinationPath(props.name + '/_/global.js'),
              props
            )
            this.fs.copyTpl(//Create global.css/scss/less
              this.templatePath('_global.css'),
              this.destinationPath(props.name + '/_/global.' + (props.preprocessor || 'css')),
              props
            )
            if(props.templating){//create templates folder
                this.fs.copyTpl(
                  this.templatePath('_empty'),
                  this.destinationPath(props.name + '/_/assets/templates/.gitkeep'),
                  props
                )
            }
            if(props.push){//create cache to facilitate three-way merge
                this.fs.copyTpl(
                  this.templatePath('_empty'),
                  this.destinationPath(props.name + '/_/cache/.gitkeep'),
                  props
                )
            }
            if(props.includes){//create includes folder
              this.fs.copyTpl(
                this.templatePath('_empty'),
                this.destinationPath(props.name + '/_/includes/.gitkeep'),
                props
              )
            }
            break;
        }
      }
    }
  },
  install: function () {
    if(this.props.taskrunner)
      console.log('Don\'t forget to run "npm install" in your experiment directory');
  }
});
