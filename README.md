# Jacquard - Yarn Compiler

This compiles Yarn syntax (with help of the [yarn parser](https://github.com/StirfireStudios/Jacquard-YarnParser) into a simpler bytecode suitable for running in games/browsers

## Usage

Install `jacquard-yarncompiler` via your favourite javascript package tool.

## Opcode/Command List & Info

Take a look [here](https://github.com/StirfireStudios/Jacquard-YarnCompiler/blob/master/src/commands/index.js#L9)

## Building/Developing

### Dependencies

Jacquard - Yarn Parser requires the following dependencies be pre-installed:

* NodeJS (https://nodejs.org).
* Yarn package manager (https://yarnpkg.com).

First, you need to make sure that you have nodeJs and Yarn installed (see the dependencies section above and install the relevant version for your platform).

Currenlty we're using `node v8.9.4` and `yarn v1.5.1`.

### Spin up instructions

Using your command line, navigate to the directory you've cloned this repo into.

  1. Execute a `yarn install`. This will download all the necessary libraries you need.
