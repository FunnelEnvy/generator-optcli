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

Create an optcli Project from within any directory

```bash
yo optcli:project
```

#### Experiment

Create an optcli Experiment within a project directory

```bash
yo optcli:experiment
```

#### Variation

Create an optcli Variation within an experiment directory

```bash
yo optcli:vatiation
```

###Advanced Sub-Generator

Advanced sub-generators will create a gulpfile that will enabled advanced features including:
 - Templating
 - Style Pre-Processing (less,scss)
 - And more...


#### Experiment (Advanced)

Create an optcli Experiment

```bash
yo optcli:experiment-advanced
```

#### Variation (Advanced)

Create an optcli Variation

```bash
yo optcli:vatiation-advanced
 ```

####Advanced Features
It's important to note that the advanced feature will create two additional directories within your experiment directory; an 'input' directory with the files to edit and an 'output' directory with files to be served or pushed via optcli.

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
######experiment.js

---
```js
console.log("<%- strings['greeting'] %>");//hello
```

#####Templating with templates/
If you choose this option, a special a 'templates' object will be available in for ejs templating. The strings object is populated from files in the 'input/templates'. Note, that when importing strings from the templates object, you'll have to use the 'decodeURIComponent'


######templates/sample.html

---
```html
<div>Sample</div>
```
######experiment.js

---
```js
console.log(decodeURIComponent("<%- templates['sample.html'] %>"));
```
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
######variation.js

---
```js
new window.Experinemt();
```
## License

MIT
