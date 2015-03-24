# optcli Generator (generator-optcli)

> [Yeoman](http://yeoman.io) generator


Generator for local optcli Projects, Experiments, and Variations for use with optcli

## What is optcli?


Optcli (https://www.github.com/funnelenvy/optcli) is a command line tool that's used for creating optcli experiments locallly.

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


## License

MIT
