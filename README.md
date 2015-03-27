# Optcli Generator (generator-optcli)

> [Yeoman](http://yeoman.io) generator


Generator for local optcli Projects, Experiments, and Variations for use with optcli

## What is optcli?
[Optcli](https://www.github.com/funnelenvy/optcli) is a command line tool that's used for creating and previewing optcli experiments locallly.

## Installation

If you don't already have you, a scaffolding too installed, install it with:

```bash
npm install -g yo
```

Install the optcli generator with:

```bash
npm install -g generator-optcli
```

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
yo optcli:vatiation
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
- or -
```bash
gulp default
```

##### gulp watch
Running this task is exactly like running the default task, except it will recompile your input folder into your output folder automatically whenever there is a change

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

###### flag: --experiment
The experiment flag will push an experiment from a given directory

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

###### webinterface: localhost
Once you've started hosting, you can visit http://localhost:8080 or (https://localhost:8080 if your experiment's edit url is uses https).

This page will help you to install the userscript associated with optcli

###### secure hosting (this section probably isn't terribly clear)
When hosting a secure site, things may, at first, appear not to work. If this happens, visit https://localhost:8080 and tell your browser to allow you to visit the site. This warning is generally for sites

When hosting a secure site for the first time, if you don't have a certificate file (__server.cert__) and a key file (__server.key__) file in your directory, new ones will be created for you. You can uses these files to host other variations in the future. Furthermore, if you associate the certificate with your browser, when you use this pair of files for hosting in the future, you won't have to worry about the aforementioned issues of your browser not working.


## License

MIT
