#Optcli

Note: the [original optcli tool](https://github.com/funnelenvy/Optimizely-cli) is depricated in favor of the workflow described here.

__Optcli__ is a set of tools used by developers to create and manipulate Optimizely experiments on their local machines in addition to using the Optimizely web interface.

By developing locally, you are free to use whichever tools you want -- text editors, IDEs, and even precompilers -- to develop Optimizely experiments.

In addition to developing locally, optcli adds a number of optional features that make test development easier and more efficient:

- Style Sheet Preprocessors -- Use SCSS or LESS instead of just plain CSS
- Templating -- Create html template files that can be automatically included in your script files, rather than manually and painstakingly creating complicated string within javascript.
- Concatenate -- Import and concatenate scripts into your own, eliminating the need to fetch resources at run time
- ECMAScript 6 -- Use the latest additions to JavaScript, such as classes and generators, to make your code more efficient
- Much much more!


##Introduction

Optcli, much like the [Yeoman project](http://yeoman.io/) that inspired it, optcli is built on a set of open source tools.

- [yo](https://github.com/yeoman/yo) -- __yo__ is a scaffolding tool used to create projects, experiments, and variations on your local machine.

  - [generator-optcli](https://github.com/funnelenvy/generator-optcli) -- __yo__ uses the __optcli generator__ to create a directory of local files and folders that can be hosted locally and/or pushed to Optimizely. It also creates a task runner file used in conjunction with gulp that's responsible for hosting variations locally and pushing content to Optimizely.



- [localghost](https://github.com/funnelenvy/localghost) -- __localghost__ is a local server used to host and test variations locally before being pushed to Optimizely. Note: once installed, there is a gulp task that will call localghost automatically -- you will not have to call it yourself.

- [gulp](https://github.com/gulpjs/gulp) -- __gulp__ is a tasks runner that's used to preform tasks associated with your experiment. It is used to host files locally, and push files to Optimizely. It is also used to facilitate the optional features mentioned above.

##Installation

To install __optcli__, first you must install [node](https://nodejs.org/). Node is a runtime that the application requires and npm is a package manager that makes it easy to install runtime components. You'll also need [npm](https://www.npmjs.com/) -- a pacage manager -- but it's installed alongside node by default.

Once the prerequisites have been installed, on your command line, enter the following command in your terminal:

```bash
npm install -g yo generator-optcli localhost gulp
```
Note: if the installation fails, try installing with the sudo command:

```bash
sudo npm install -g yo generator-optcli localhost gulp
```

You now have all the necessary components installed to start working.


## Usage

```bash
yo optcli:<name of sub generator>
```

This generator does not a have a default action, so you'll have to use it with one of the below sub generators

###Sub-Generator

#### Project

Create an optcli Project from within any directory.
Yo can crate a project in any directory on your system.

```bash
yo optcli:project
```

#### Experiment

Create an optcli Experiment within a project directory
Ensure that you are within an project directory before using.


```bash
yo optcli:experiment
```

#### Variation

Create an optcli Variation within an experiment directory
Ensure that you are within an experiment directory before using


```bash
yo optcli:variation
```

###Advanced Sub-Generator

Advanced sub-generators will create a gulpfile that will enabled advanced features including:
 - Templating
 - Style Pre-Processing (less, scss)
 - And more...


#### Experiment (Advanced)

Create an optcli Experiment within a project directory
Ensure that you are within an project directory before using

```bash
yo optcli:experiment-advanced
```

#### Variation (Advanced)

Create an optcli Variation within an experiment (advanced) directory
Ensure that you are within an experiment directory before using.


```bash
yo optcli:variation-advanced
 ```

####Advanced Scaffolding
It's important to note that the advanced feature will create two additional directories within your experiment directory; an __'input'__ directory with the files to edit and an __'output'__ directory with files to be served or pushed via optcli. Running the default gulp task (by typing either 'gulp' or 'gulp default')

#####Style Pre-processing
You can choose to use scss or less instead of plain css

#####Templating with strings.json
If you choose this option, a special a 'strings' object will be available in for ejs templating. The strings object is populated from a 'input/strings.json' file.

######strings.json

---
```json
{
  "greeting":"hello"
}
```
---
######experiment.js

---
```js
console.log("<%- strings['greeting'] %>");//hello
```
---

#####Templating with templates/
If you choose this option, a special a 'templates' object will be available in for ejs templating. The strings object is populated from files in the 'input/templates'. Note, that when importing strings from the templates object, you'll have to use the 'decodeURIComponent'


######templates/sample.html

---
```html
<div>Sample</div>
```
---
######experiment.js

---
```js
console.log(decodeURIComponent("<%- templates['sample.html'] %>"));
```
---
#####EJS Processing
If you choose this option, you can take advantage of many of the features coming in the next version of javascript. See [babel.js](https://babeljs.io/).

######experiment.js
---
```js
class Experiment{
  constructor(){

  }
}
window.Experiment = Experiment
```
---
######variation.js
---
```js
new window.Experinemt();
```
---
####Gulp Tasks
Other than the default tasks, we've included a few other tasks for your convinience

##### gulp / gulp default
Running this tasks will compile you experiment's input folder and place the contents into your output folder.

```bash
gulp
```
__OR__
```bash
gulp default
```

##### gulp watch
Running this task is exactly like running the default task, except it will recompile your input folder into your output folder automatically whenever there is a change.

```bash
gulp watch
```

##### gulp push
Gulp push requires exactly one of three flags to work.

###### flag: --experiment
The experiment flag will push an experiment from a given directory

Example:
```bash
gulp push --experiment output

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

(NOTE: this section could use some improvement)


When hosting a secure site, things may, at first, appear not to work. If this happens, visit https://localhost:8080 and tell your browser to allow you to visit the site. This warning is generally for sites

When hosting a secure site for the first time, if you don't have a certificate file (__server.cert__) and a key file (__server.key__) file in your directory, new ones will be created for you. You can uses these files to host other variations in the future. Furthermore, if you associate the certificate with your browser, when you use this pair of files for hosting in the future, you won't have to worry about the aforementioned issues of your browser not working.


## License

MIT
