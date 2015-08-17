#Optcli

Note: This is an alternative implementation of the [Funnel Envy](http://funnelenvy.com)'s [optcli tool](https://github.com/funnelenvy/Optimizely-cli). Rather than being a stand-alone tool, this generator makes use of readily available open source tools.

__Optcli__ is a set of tools used by developers to create and manipulate [Optimizely](http://www.optimizely.com) experiments on their local machines in addition to using the Optimizely web interface.

By developing locally, you are free to use whichever tools you want -- text editors, IDEs, and even precompilers.

In addition to developing locally, optcli adds a number of optional features that make test development easier and more efficient.

##Recent ChangeLog
###0.1.0
- Remove ES6 support (considering [Typescript]() instead)
- Modify folder structure
- Overhaul templating system
  - template function replaces templates object in ejs context
  - template function produces an array of strings instead of a flat string
  - templates function can take a locals variable for rendering
- "Import" js from in includes folder
- Removed strings.json functionality. (Add data to package.json instead)
- Incorporated '\*-advanced' functionality into 'regular' generators


##Introduction

Optcli, much like the [Yeoman project](http://yeoman.io/) that inspired it, optcli is built on a set of open source tools.

- [yo](https://github.com/yeoman/yo) -- __yo__ is a scaffolding tool used to create projects, experiments, and variations on your local machine.

  - [generator-optcli](https://github.com/funnelenvy/generator-optcli) -- __yo__ uses the __optcli generator__ to create a directory of local files and folders that can be hosted locally and/or pushed to Optimizely. It also creates a task runner file used in conjunction with gulp that's responsible for hosting variations locally and pushing content to Optimizely.

- [gulp](https://github.com/gulpjs/gulp) -- __gulp__ is a tasks runner that's used to preform tasks associated with your experiment. It is used to host files locally, and push files to Optimizely. It is also used to facilitate the optional features mentioned above. Support is planned for other task runners including [grunt]() and [brocoli]().

##Installation

###Prerequesites

To install __optcli__, first you must download and run the __node__ installer from [https://nodejs.org/](https://nodejs.org/). Node is a runtime that the optcli application requires.

Second, you'll need [npm](https://www.npmjs.com/), a package manager that makes it easy to install runtime components. It's installed alongside node by default, so you can likely ignore this step.

(Note : Some users that have installed node via methods other than the one above have had issues using yo. For best results, please install/update you node installation only via downloading the installer from [nodejs.org](http://nodejs.org) )

###Components

Once the prerequisites have been installed, on your command line, enter the following command in your terminal to install all necessary components:

```bash
npm install -g yo generator-optcli gulp
```

You now have all the necessary components installed to start working.

## Usage

```bash
yo optcli:<generator>
```
###Generator -- Project

Create an optcli Project from within any directory.
Yo can crate a project in any directory on your system.

```bash
yo optcli:project
```

###Generator -- Experiment

Create an optcli Experiment within a project directory.
Ensure that you are within an project directory before using.

```bash
yo optcli:experiment
```

###Generator --  Variation

Create an optcli Variation within an experiment directory
Ensure that you are within an experiment directory before using

```bash
yo optcli:variation
```
####Taskrunner
The experiment generator allows you to optionally create a taskrunner file.
Currently, this is a gulp file, but there are plans to support other taskrunners
in the future.


The generated gulpfile's default tag facilitates the following features:
- Stylesheet Pre-procesing
- Javascript File Concatination
- templating

Edit the files within the experiment directory and run the command

```bash
gulp
```

 or

```bash
gulp default
```
to transpile them into global.js, global.css, and variation.js files for hosting
and pushing to optiizly.

#####Stylesheet Pre-processing
You can choose to use less or scss instead of plain css.
In addition, files are auto-prefixed to help ensure compatibility.

#####Javascript File Concatination
Files in the folder \_/includes folder will be incorporated into the mail global.js file.

\_/includes/jayquery.js
```javascript
  window.$ = function(){
    alert('this is not jquery');
    return undefined;
  }
```

\_/global.js
```
  var crucialDomObject = $('.pleaseBeThere');
```

\_/global.js
```
  window.$ = function(){
    alert('this is not jquery');
    return undefined;
  }
  var crucialDomObject = $('.pleaseBeThere');
```

#####Templating
Each file script and style is processed as an EJS file. The ejs context contains specific objects:
  - template - this function takes the name of a file from ./\_/assets/templates
  and returns an array of strings representing its lines.
  It takes a second, optional parameter to be passed as a separate ejs context
  - templateArray - This function is a mask for the template function which will additionally return the template as a formatted array that can be directly set as a javascript variable. 
  - hx - this function takes a string and hashes it. Can be useful for creating classes that avoid collisions with other experiments.
  - package - this object contains the contents of package.json
  - experiment - this object contains the context of experiment.json
  - variation - per variations, this object contains the contents of variation.json.
    Note: this is only available when processing a \_variation.js file into a variation.js file.
    In other contexts, this will throw an error.

######Template Usage : Incorporate Experiment Data
You Experiment data is a often useful. Why not incorporate it into the experiment itself?

These files:

experiment.json
```json
{

  "description":"Title Test"

}
```

0/variation.json
```json
{
  "description":"First Title"
}
```
1/variation.json
```json
{
  "description":"Second Title"
}
```

\_global.js
```javascript
console.log("Experiment Running: <%= experiment.description%>")

```

0/\_variation.js
```javascript
$('title').text("<%= variation.description%>");

```
1/\_variation.js
```javascript
$('title').text("<%= variation.description%>");

```

, once processed will become:

global.js
```javascript
console.log("Experiment Running: Title Test")

```

0/variation.js
```javascript
$('title').text("First Title");

```
1/variation.js
```javascript
$('title').text("Second Title");

```

You can also include custom data from package.json:

The files:

```json
//package.json
{
  ...
  "logo":"logo.png"
}
```

0/\_variation.js
```javascript
$('img').href("<%= package.logo %>");

```

, once processed will become:


0/\_variation.js
```javascript
$('img').href("logo.png");

```

######Template Usage : Build UI Elements
Files in the \_/assets/templates/ folder are incorporated into the ejs context
by passing it's base file name into the template function.

The files:

\_/assets/templates/logobox.html
```html
<div>
  <img src=\"logo.png\" />
</div>
```
0/\_variation.js
```js
var logobox = <%- templateArray('logobox.html') %>;
$('body').append(logobox);
```

, once processed will become:

0/variation.js
```js
var logobox = ["<div>","  <img src='logo.png' />","</div>"].join('');
$('body').append(logobox);
```

By passing in a locals object as the second argument to template
fliles can be processes as ejs files in a separate context:

The files:

\_/assets/templates/logobox.html

//package.json
{
  ...
  "logo":"logo.png"
}

```html
<div>
  <img src=\"<%= logo %>\" />
</div>
```

0/\_variation.js
```js
var logobox = [''<% template('logobox.html', {logo:package.logo}).forEach(function(line){ %>
  ,'<%- line %>'<%})%>].join('\n');
$('body').append(logobox);
```

, once processed will become:

0/variation.js
```js
var logobox = [''
  ,"<div>",
  ,"  <img src=\"logo.png\" />",
  ,"</div>"].join('');
$('body').append(logobox);
```

Alternatively, the files:

\_/assets/templates/logobox.html
```html
<div>
  <img src=\"logo.png\" />
</div>
```

0/\_/variation.js
```javascript
var logobox = '\
  <% template("logobox.html").forEach(function(line){ %>
    <%- line + '\\'%><%})%>\';
    '
```

will produce:

0/variation.js
```javascript
var logobox = '\'
  <div>\
    <img src=\"logo.png\" />\
  </div>';
```
However; note the trailing "'" here. It will cause an error if used in the code, but it's to preserve syntax highlighting in this document, as most parsers have a hard time handling the specified content above. For this reason, you are discouraged from incorporating templates in this way.


######Template Usage : Ensure Unique Classnames

Use the hash function in order to ensure unique class names in your style code.

/global.css
```css
  .popup .button{

  }
  /*this may cause issues if something else decides to use the name 'popup'*/
```

\_/global.css
```css
  .cls<%=hx('popup')%> .button{

  }
  /*this will produce a unique string of characters unique to the experiment,
  unlikely to cause collisions*/

```


####Gulp Tasks
Other than the default tasks, we've included a few other tasks for your convinience:

##### gulp watch
Running this task is exactly like running the default task, except it will recompile your _ folders whenever files are changed.
It will also recompile whenever your package.json, experiment.json, or variation.json files are changed.

Example:
```bash
gulp watch
```

##### gulp lint
This task ensures that your code conforms to good coding practices

Example:
```bash
gulp lint
```

##### gulp push
Gulp push requires exactly one of three flags to work.

###### flag: --experiment
The experiment flag will push an experiment from a given directory

Example:
```bash
gulp push --experiment

```

###### flag: --variation
The variation flag will push a variation from a given directory

```bash
gulp push --variation output/Default\ Variation

```

###### flag: --all
The all flag will push an experiment from a given directory AND variations created in subdirectories

```bash
gulp push --all output

```

##### gulp host
Running this task will host your local variations
Gulp host runs localghost externally

###### flag: --variation
Use the variation flag to specify the directory of the variation being hosted. This is mandatory. You probably want to point this to your output folder.

```bash
gulp host --variation output/<path to variation>

```

###### flag: --live
Using this flag will cause the hosted variation to refresh whenever files are changed.

```bash
gulp host --live --variation output/<path to variation>

```

###### webinterface

(NOTE: this section could use some improvement)

Once you've started hosting, you can visit http://localhost:8080 or (https://localhost:8080 if your experiment's edit url is uses https).

This page will help you to install the userscript associated with optcli

###### secure hosting

The gulp file is designed to look at your projects url and determine if it should be hosted using ssl or not.
Hosting changes to a secure site may not initially work. If this happens, visit https://localhost:8080 and tell your browser to allow you to visit the site.

## License

MIT
