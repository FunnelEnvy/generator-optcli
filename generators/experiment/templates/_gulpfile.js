/**
This gulp file is intended for use with with optcli.

The 'main' task, run by default, preforms a number of subtasks:

 - The 'global.js' task produces an experiment level javascript file.

 - The 'global.css' task produces stylesheet file.

 - The 'variation.js' task works in much the same way as the 'global.js' task, but produces a variation level javascript file.

- Each file is also processed as an ejs template. Locals include:
   - A 'template' function created from files within a 'templates' directory.
      keys are the file names and values are arrays of the contents
   - A 'hx' function to help ensure unique strings and prevent naming
      collisions (css classes, ids etc.)

There is also a 'watch' task that watches the '.' directory runs the 'main' task should anything change.
There is also a 'lint' task to ensure good coding practices

Your working directory is assumed to be similar to:

<project folder>/
  .optcli/
    token
  project.json
    <experiment folder>/
      .git/
      readme.md
      _/
        assets/
        templates/
        includes/
        experiment.{js, ts}
        experiment.{css, scss, less}
      node_modules/
      package.json
      {gruntfile, gulpfile, brocolifile}.js
      .eslint

      experiment.js
      experiment.json
      experiment.css
      <variation>/
        _/
          includes/
          variation.{js, .ts}
        variation.js
        variation.json
*/


////////////////
//Config
////////////////
var HASHPREFIX = '<%= Date.now() %>'; //The prefix for the hx.

////////////////
//Dependencies
////////////////

//Internal
var fs = require('fs');
var path = require('path');
var Buffer = require('buffer').Buffer;

//External
var gulp = require('gulp');
var merge = require('merge-stream');<% if(templating) { %>
var ejs = require('ejs');<%}%>
var crypto = require('crypto');

//Gulp Plugins
var concat = require('gulp-concat');//Concatenate Files
var autoprefixer = require('gulp-autoprefixer');

var rename = require('gulp-rename');//Rename Files
var through = require('through-gulp');//Custom Transforms
var plumber = require('gulp-plumber');//Handles Errors
var changed = require('gulp-changed');//Caches Changes
var eslint = require('gulp-eslint');
////////////////
//Utilities
////////////////

var getFolders = function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      if(file === 'node_modules') return;
      if(file[0] === '-') return;
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};
<% if(templating) { %>
var hasher = function(str, algorithm, digest, length){
  algorithm = 'sha1' || algorithm;
  digest = 'hex' || digest;
  var hash =  HASHPREFIX + crypto
    .createHash(algorithm)
      .update(HASHPREFIX)
      .update(String(str))
        .digest(digest);
  return (length > 0) ? hash : hash.substr(0, length)
};

var defaultGetPackage = function(directory){
  var pkg = {};
  var pkgFile = path.resolve(directory, "package.json");
  if(fs.existsSync(pkgFile)){
    pkg = JSON.parse(fs.readFileSync(pkgFile));
  }
  return pkg;
};

var defaultGetExperiment = function(directory){
  var experiment = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), directory, "experiment.json"), {encoding:"utf-8"})
    );
  return experiment;
};

var defaultGetVariation = function(directory){
  var variation = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(),directory, "variation.json"), {encoding:"utf-8"})
    );
  return variation;
};
var defaultGetTemplates = function(directory){
  var templates = {};
  var templatesDir = path.resolve(directory, "_/assets/templates/");
  if(fs.existsSync(templatesDir)){
    fs.readdirSync(templatesDir).forEach(function(file) {
      templates[file] = fs.readFileSync(path.resolve(templatesDir,file),
        'utf-8')
        .replace(/(?:\r\n|\r|\n)/g, '\n')
    });
  }
  return function(key, locals){
    var template = templates[key] || '';
    return (locals ? ejs.render(template, locals) : template)
    .split('\n')
    .map(function(text){return text});
  }
};
var ejsTemplate = function(data){
  var contents = data.contents.toString('utf8');
  var locals = {
       template : defaultGetTemplates('.'),
       package  : defaultGetPackage('.'),
       hx       : hasher,
       experiment : defaultGetExperiment('.')
     };
  contents = ejs.render(contents.toString('utf8'), locals);
  data.contents = new Buffer(contents);
  return data;
};
var ejsTemplateVariation = function(dir){
  return function(data){
    var contents = data.contents.toString('utf8');
    var locals = {
         template : defaultGetTemplates('.'),
         package  : defaultGetPackage('.'),
         hx       : hasher,
         experiment : defaultGetExperiment('.'),
         variation  : defaultGetVariation('.' + '/' + dir)
       };
    contents = ejs.render(contents.toString('utf8'), locals);
    data.contents = new Buffer(contents);
    return data;
  };
}
<% }%>
////////////////
//Utilities Tasks
////////////////
var count = 0;
gulp.task('utility.count',function(){
  console.log('count: %s', ++count)
});

////////////////
//Tasks
////////////////

//Task: global.js
gulp.task('global.js', function(){
  return gulp.src([
    path.join('.','/_/includes/*.*'),
    path.join('.', '_/global.js')
  ])
  .pipe(plumber())
  .pipe(concat('global.js'))//Concatenate
  <% if(templating) { %>.pipe(through.map(ejsTemplate))//EJS<% }%>
  .pipe(gulp.dest('.'));
});

//Task: global.css
<% if(preprocessor === "less"){ %>
var preprocessor = require('gulp-less');//Convert LESS to CSS
<%}%>
<%if(preprocessor === 'scss'){ %>
var preprocessor = require('gulp-sass');//Convert SCSS to CSS
<%}%>
gulp.task('global.css', function(){
  return gulp.src(path.join('.', '_/global.<%= preprocessor ? (preprocessor === "less" ? "less" : "scss") : "css"%>' ))
  .pipe(plumber())
  <% if(templating) { %>.pipe(through.map(ejsTemplate))//EJS<% }%>
  <% if(preprocessor){ %>.pipe(preprocessor())<%}%>
  .pipe(autoprefixer({
      browsers:['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
  }))//Automatic Prefixes
  .pipe(rename('global.css'))//Rename
  .pipe(gulp.dest('.'));
});

//Task: variation.js
gulp.task('variation.js', function(){
  var folders = getFolders('.');
  var tasks = folders.map(function(dir) {
     return gulp.src([
         path.join('.', dir, '/_/includes/*.*'),
         path.join('.', dir, '_/variation.js')
       ])
       .pipe(plumber())
       .pipe(concat('variation.js'))
       <% if(templating) { %>.pipe(through.map(ejsTemplateVariation(dir)))//EJS<% }%>
       .pipe(gulp.dest(path.join('.', dir)));
  });
  return merge(tasks);
});

//Task: lint
gulp.task('lint', function () {
    return gulp.src(['**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

//Task: main
gulp.task('main',
['global.js', 'global.css','variation.js'])

//Task: watch
gulp.task('watch', ['main'], function(){
  var watchFiles = [
    path.join('.', "_/**.*"),
    path.join('.', "experiment.json"),
    path.join('.', "package.json"),
    path.join('.', "**/_/**.*"),
    path.join('.', "**/variation.json"),
  ];
  gulp.watch(watchFiles, ['main']);
  console.log('Watching:');
  console.log(watchFiles.join('\n'));
});

//Task: default
gulp.task('default', ['main']);

<%if(push){ %>/**
 *@pubilc
 *@task push
 *@description push an experiment or variation to optimizely
 */

var argv = require('yargs').argv;
var OptimizelyClient = require('optimizely-node-client');
var child_process = require('child_process');

var expFromDir = function(directory){
  var experiment_json = path.resolve(directory, 'experiment.json');
  var experiment_css = path.resolve(directory, 'global.css');
  var experiment_js = path.resolve(directory, 'global.js');
  var experiment = JSON.parse(fs.readFileSync(experiment_json,'utf8'));
  experiment_js = fs.readFileSync(experiment_js,'utf8');
  experiment_css = fs.readFileSync(experiment_css,'utf8');
  experiment.custom_js = experiment_js;
  experiment.custom_css = experiment_css;
  return experiment;
};

var varFromDir = function(directory){
  var variation_json = path.resolve(directory, 'variation.json');
  var variation_js = path.resolve(directory, 'variation.js');
  var variation = JSON.parse(fs.readFileSync(variation_json,'utf8'));
  variation_js = fs.readFileSync(variation_js,'utf8');
  variation.js_component = variation_js;
  return variation;
};

var jsonFromExp = function(directory, experiment){
  fs.writeFileSync(path.resolve(directory,"global.js"), experiment.custom_js || "");
  fs.writeFileSync(path.resolve(directory,"global.css"), experiment.custom_css || "");
  experiment = JSON.parse(JSON.stringify(experiment));
  delete experiment.custom_js;
  delete experiment.custom_css;
  return fs.writeFileSync(path.resolve(directory,"experiment.json"), JSON.stringify(experiment, null, " "));
};

var jsonFromVar = function(directory, variation){
  fs.writeFileSync(path.resolve(directory,"variation.js"), variation.js_component || "");
  variation = JSON.parse(JSON.stringify(variation));
  delete variation.js_component;
  return fs.writeFileSync(path.resolve(directory,"variation.json"), JSON.stringify(variation, null, " "));
};

gulp.task('push', function(){
  var parentDirectory = path.resolve(process.cwd(), '..');
  var directory = argv.variation || argv.experiment || argv.all || "";
  if(!directory){
    console.error("Please specify directory with --experiment, --variation, or --all");
    return;
  }
  if(directory === true) directory = '.';
  directory = path.resolve(directory);
  var APIToken = fs.readFileSync(
    argv.token? path.resolve(argv.token) :
    path.resolve(parentDirectory,".optcli","token"), {encoding:"utf-8"}).trim();
  if(!APIToken){
    console.error("Missing token.");
    return;
  }
  var client = new OptimizelyClient(APIToken);
  if(argv.experiment || argv.all){
    var experiment = expFromDir(directory);
    experiment.project_id = JSON.parse(
        fs.readFileSync(
          path.resolve(parentDirectory,"project.json"), {encoding:"utf-8"})
      ).id;
    if(!experiment.project_id){
      console.error("Missing project id.");
      return;
    }
    var createOrUpdate = experiment.id? 'update' : 'create';
    client.pushExperiment(experiment)
    .then(
      function(updatedExperiment){
        console.log("%sd experiment: " + updatedExperiment.id, createOrUpdate);
          jsonFromExp(directory, updatedExperiment);
          if(argv.all){
            getFolders(directory).forEach(function(folder){
              var output = child_process.spawn("gulp",
                [
                  'push',
                  '--variation',
                  path.join(directory, folder)
                ],
                {stdio: "inherit"}
              );
            })
          }
        },
      function(error){
        console.error("Unable to %s experiment: " + error.message, createOrUpdate);
        console.error(error.stack);
      }
    );
  }else{
    var variation = varFromDir(directory);
    variation.experiment_id = JSON.parse(
        fs.readFileSync(
          path.resolve(directory,"..","experiment.json"), {encoding:"utf-8"})
      ).id;
    if(!variation.experiment_id){
      console.error("Missing experiment id.");
      return;
    }
    var createOrUpdate = variation.id? 'update' : 'create';
    client.pushVariation(variation)
    .then(
      function(updatedVariation){
        console.log(
           "%sd variation: " + updatedVariation.id,
           createOrUpdate);
          jsonFromVar(directory, updatedVariation);
        },
      function(error){
        console.error(
          "Unable to %s variation: " + error.message,
          createOrUpdate);
        console.error(error.stack);
      }
    );
  }
})
<%}%>



 <%if(host){ %>
/**
*@pubilc
*@task host
*@description host an experiment variaton on optimizely
*/

 gulp.task('host', function(){
   var directory = argv.variation === true ? "" : argv.variation;
   if(!directory){
     return console.error("Missing variation folder (--variation)");
   }
   var project = JSON.parse(
       fs.readFileSync(
         path.resolve(process.cwd(), '..','project.json'), {encoding:"utf-8"})
     );
   var experiment = JSON.parse(
       fs.readFileSync(
         path.resolve(directory,'..',"experiment.json"), {encoding:"utf-8"})
     );
   var arguments = {};
   if(argv.live) arguments.live = true;
   console.log('Serving %s', experiment.edit_url)
   if(experiment.edit_url.indexOf('https') === 0){
     arguments.https = true;
     arguments.useinternal = true;
   }
   if(project.include_jquery && project.include_jquery !== 'false'){
     arguments.jquery = true;
   }
   var globalCSS = path.resolve(directory, "..", "global.css");
   var globalJS = path.resolve(directory, "..", "global.js");
   var variationJS = path.resolve(directory, "variation.js");
   arguments.css = [globalCSS];
   arguments.js = [globalJS , variationJS];
   arguments.userscript = true;
   require('localghost')(arguments);
 })
 <%}%>
