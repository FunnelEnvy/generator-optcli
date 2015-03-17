# Optimizely Generator (generator-optimizely)

> [Yeoman](http://yeoman.io) generator


Generator for local Optimizely Projects, Experiments, and Variations for use with optcli

## What is optcli?


Optcli (https://www.github.com/funnelenvy/optcli) is a command line tool that's used for creating optimizely experiments locallly.

## Installation

If you don't already have you, a scaffolding too installed, install it with:

```bash
npm install -g yo
```

Install the optimizely generator with:

```bash
npm install -g generator-optimizely
```

## Usage

```bash
yo optimizely:<name of sub generator>
```

This generator does not a have a default action, so you'll have to use it with one of the below sub generators




###Sub-Generator

#### Project

Create an Optimizely Project

```bash
yo optimizely:project
```

#### Experiment

Create an Optimizely Experiment

```bash
yo optimizely:experiment
```

#### Variation

Create an Optimizely Variation

```bash
yo optimizely:vatiation
```

###Advanced Sub-Generator

Advanced sub-generators will create a gulpfile that will enabled advanced features including:
 - Templating
 - Style Pre-Processing (less,scss)
 - And more...

#### Experiment (Advanced)

Create an Optimizely Experiment

```bash
yo optimizely:experiment-advanced
```

#### Variation (Advanced)

Create an Optimizely Variation

```bash
yo optimizely:vatiation-advanced
 ```


## License

MIT
