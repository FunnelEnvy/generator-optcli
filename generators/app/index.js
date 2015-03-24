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
    console.log(
      'No default task. Usage information located at: %s', require('../../package.json').repository
    );
    done();
  },
});
