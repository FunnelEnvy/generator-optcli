////////////////
//Usage
////////////////
/**
This gulp file is intended for use with with optcli.

The 'main' task, run by default, preforms a number of subtasks:

 - The 'global.js' subtask produces an experiment level javascript file by concatenating any number of javascript files and compiling them into a single file. This task also takes advantage of the babel javascript transpiler to allow the use of future versions of javascript... today! Visit https://babeljs.io/ to learn more.

 - The 'global.css' subtask produces stylesheet file by converting a scss file into a css file.

 - The 'variation.js' subtask works in much the same way as the 'global.js' task, but produces a variation level javascript file.

- Each file is also processed as an ejs template. Locals include:
   - A 'templates' object created from files within a 'templates' directory.
      keys are the file names and values are the contents
   - A 'strings' object imported from an 'strings.json' file.
   - A 'hasher' function to help ensure unique strings and prevent naming
      collisions (css classes, ids etc.)
Besure to properly decode/unescape strings broungt into your code through the templating feature.

There is also a 'watch' task that watches the SOURCE directory runs the 'main' task should anything change.

Example - Running the main gulp task on this directory:

input/
  templates/
  strings.json
  arbitrary1.js (es6)
  arbitrary2.js (es6)
  ...
  global.js (es6)
  global.scss (scss)
  var_1/
    arbitraryA.js (es6)
    arbitraryB.js (es6)
    ...
    variation.js (es6)
  var_2/
    arbitraryC.js (es6)
    arbitraryD.js (es6)
    ...
    variation.js (es6)

will result in this directory:

output/
  global.js (es5)
  global.css (scss)
  var_1/
    variation.js (es5)
  var_2/
    variation.js (es5)

Also, I've set up my working directory like so:

<project>/
  .optcli/
    token
  project.json
  <experiment>/
    gulpfile.js
    package.json (for gulpfile)
    node_modules (for gulpfile)
    input/ (see above)
    output/ (see above)

Some Notes:

  Your working directory is assumed to be a project director as above.

  Create your experiment with:
  'optcli experiment <experiment>/DEST <description> <url>'

  Create your variations with:
  'optcli variation <experiment>/DEST <variaition> <description>'

  Optcli will handle the various json files when pushing, so you won't need to touch the '<experiment>/DEST' directory anymore.

  Host a specific variation with
  'optcli host -lt :watch <experiment>/DEST/<variation>'
  or
  'optcli host -slt :watch <experiment>/DEST/<variation>' (ssl)
  You can also user the longer versions, which, honestly isn't much longer
  'optcli host --live --task=gulp:watch <experiment>/DEST/<variation>'
  'optcli host --ssl --live --task=gulp:watch <experiment>/DEST/<variation>'

  Modify the input directory

  The accompaning package.json file is not necessary.
  but having it around will allow you to install all gulpfile dependancies with a simple 'npm install'.
.
*/


////////////////
//Config
////////////////
var SOURCE = 'input'; //The source folder
var DEST = 'output'; //The destination
var HASHPREFIX = 'ab64-'; //The prefix for the hasher.

////////////////
//Dependencies
////////////////

//Internal
var fs = require('fs');
var path = require('path');
var Buffer = require('buffer').Buffer;

//External
var gulp = require('gulp');
var merge = require('merge-stream');
var ejs = require('ejs');
var crypto = require('crypto');

//Gulp Plugins
<%if(babel){ %>var babel = require('gulp-babel');//Compile ES6<%}%>


var concat = require('gulp-concat');//Concatenate Files
var autoprefixer = require('gulp-autoprefixer');
<% if(preprocessor === "less"){ %>
  var preprocessor = require('gulp-less');//Convert LESS to CSS
<%}%>
<%if(preprocessor === 'scss'){ %>
  var preprocessor = require('gulp-less');//Convert SCSS to CSS
<%}%>
var rename = require('gulp-rename');//Rename Files
var through = require('through-gulp');//Custom Transforms
var plumber = require('gulp-plumber');//Handles Errors
var changed = require('gulp-changed');//Caches Changes
////////////////
//Utilities
////////////////

var getFolders = function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      if(file === 'node_modules') return;
      if(file === 'templates') return;
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

var hasher = function(str){
  return HASHPREFIX + crypto
    .createHash('sha1')
      .update(HASHPREFIX)
      .update(str)
        .digest('hex').substr(0,10);
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

var defaultGetStrings = function(directory){
  var strings = {};
  var stringsFile = path.resolve(directory, "strings.json");
  if(fs.existsSync(stringsFile)){
    strings = JSON.parse(fs.readFileSync(stringsFile));
  }
  return strings;
};

var ejsStrings = function(data){
  var locals =    {
       strings : defaultGetStrings(SOURCE),
       hasher : hasher
     };
  return ejs.render(data, locals);
};
var defaultGetTemplates = function(directory){
  var templates = {};
  var templatesDir = path.resolve(directory, "templates");
  if(fs.existsSync(templatesDir)){
    fs.readdirSync(templatesDir).forEach(function(file) {
      var text = fs.readFileSync(path.resolve(templatesDir,file),
        'utf-8').replace(/(?:\r\n|\r|\n)/g, '\n');
        templates[file] = escape(ejsStrings(text));
    });
  }
  return templates;
};

var ejsTemplate = function(data){
  var contents = data.contents.toString('utf8');
  var locals =    {
       templates : defaultGetTemplates(SOURCE),
       strings : defaultGetStrings(SOURCE),
       hasher : hasher
     };
  contents = ejs.render(contents.toString('utf8'), locals);
  data.contents = new Buffer(contents);
  return data;
};

////////////////
//Utilities Tasks
////////////////
var count = 0;
gulp.task('utility.count',function(){
  console.log('count: %s', ++count)
});

//Global JS
gulp.task('global.js', function(){
  return gulp.src([
    path.join(SOURCE,'!(global)*.js'),
    path.join(SOURCE, 'global.js')//Add global.js last
  ])
  .pipe(plumber())
  .pipe(concat('global.js'))//Concatenate
  .pipe(through.map(ejsTemplate))//EJS
  <%if(babel){ %>.pipe(babel)//ES6<%}%>
  .pipe(gulp.dest(DEST));
});

//Global CSS
gulp.task('global.css', function(){
  return gulp.src(path.join(SOURCE, 'global.<%= preprocessor ? (preprocessor === "less" ? "less" : "sass") : "css"%>' ))
  .pipe(plumber())
  <% if(template || template1) { %>.pipe(through.map(ejsTemplate))//EJS<% }%>
  <%if(preprocessor){ %>.pipe(preprocessor)<%}%>
  .pipe(autoprefixer({
      browsers:['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
  }))//Automatic Prefixes
  .pipe(rename('global.css'))//Rename
  .pipe(gulp.dest(DEST));
});

//Variation JS
gulp.task('variation.js', function(){
  var folders = getFolders(SOURCE);
  var tasks = folders.map(function(dir) {
     return gulp.src([
         path.join(SOURCE, dir, '!(variation)*.js'),
         path.join(SOURCE, dir, 'variation.js')//Add variation.js last
       ])
       .pipe(plumber())
       .pipe(concat('variation.js'))//Concatenate
       <% if(template || template1) { %>.pipe(through.map(ejsTemplate))//EJS<% }%>
       <%if(babel){ %>.pipe(babel)<%}%>
       .pipe(gulp.dest(path.join(DEST, dir)));
  });
  return merge(tasks);
});

//Main
gulp.task('main',
['global.js', 'global.css','variation.js', 'utility.count'])

//Watch
gulp.task('watch',['main'],function(){
  gulp.watch(path.join(SOURCE, "**/*.*"), ['main']);
});

//Default
gulp.task('default', ['main']);
