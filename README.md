# Jacquard - Yarn Compiler

This compiles Yarn syntax (with help of the [yarn parser](https://github.com/StirfireStudios/Jacquard-YarnParser) into a simpler bytecode suitable for running in games/browsers

## Usage

Install `jacquard-yarncompiler` via your favourite javascript package tool.

## Bytecode file format

### Types

All groupings are Little Endian. All Strings are UTF-8.

#### Fixed Length
##### Float
  1. 4 bytes - the IEEE 754 float value

##### Byte
  1. a single byte - usually either a bit-field or a unsigned integer.

#### Variable Length
##### VarInt
  1. Type (Byte) - length + signed or unsigned - top bit is if it's signed, the other 7 are the NumBytes of the number (current max length is 8 bytes)
  2. then NumBytes of 
    1. NumberPart (Bytes) - Part of the number

##### VarString
  1. NumBytes (VarInt) - indicating how long the string is in bytes.
  2. then NumBytes of
    1. StringPart (Bytes) - Part of the actual string.

##### StringTable
  1. NumEntries (VarInt) - how many entries does this table have.
  2. and then NumEntries of
    1. Entry (VarString) - the string at this entry.

##### EntryPointTable
  1. NumEntries (VarInt) - how many entries does this table have.
  2. and then NumEntries of
    1. Entry (VarString) - the string at this entry.
    2. Offset (VarInt) - the byte offset for this entry in the instruction set.

### Opcodes

Documented [here](https://github.com/StirfireStudios/Jacquard-YarnCompiler/blob/master/src/commands/index.js#L9)

Opcodes are variable length - the opcode itself is always one byte, but the arguments may be more.

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
