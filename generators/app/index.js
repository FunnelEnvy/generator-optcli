'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var funnelenvysays = require('funnelenvysays');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../../package.json');
  },
  prompting: function () {
    var done = this.async();
    this.log(
      funnelenvysays(
chalk.blue('Please use:\n') +
'yo optcli:project\n\
yo optcli:experimen\n\
or yo optcli:variation'));
    this.log(
      chalk.red('No default task.') +
      ' Usage information located at: ' +
      this.pkg.repository);
    done();
  },
});
