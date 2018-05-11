# Jacquard - Yarn Compiler

This compiles Yarn syntax (with help of the [yarn parser](https://github.com/StirfireStudios/Jacquard-YarnParser) into a simpler bytecode suitable for running in games/browsers

## Usage

Install `jacquard-yarncompiler` via your favourite javascript package tool.

## Bytecode file formats

Current version is `0.1.0`

### Types

All groupings are Little Endian. All Strings are UTF-8.

#### Fixed Length
##### Float
  1. 4 bytes - the IEEE 754 float value

##### Byte
  1. 1 byte - usually either a bit-field or a unsigned integer.

##### StackOffset
  1. 1 byte - the offset (0 being the top of the stack and 255 being the 255th oldest item on the stack) of a stack argument

#### Variable Length
##### VarInt
  1. Type (`Byte`) - length + signed or unsigned - high bit is on if it's signed, the lower 7 are the NumBytes of the number (current max length is 8 bytes). If this is 0 then there's no bytes and the value is 0.
  2. then NumBytes of 
     1. NumberPart (`Byte`) - Part of the number

##### VarBytes
  1. NumBytes (`VarInt`) - indicating how many bytes are in this value.
  2. then NumBytes of
     1. Part (Bytes) - part of this value.

##### VarString
A Varbytes where the Bytes value represents an UTF-8 encoded string value.

##### StringTable
  1. NumEntries (`VarInt`) - how many entries does this table have.
  2. and then NumEntries of
     1. Entry (`VarString`) - the string at this entry.

##### BytesEntryPointTable
  1. NumEntries (`VarInt`) - how many entries does this table have.
  2. and then NumEntries of
     1. Entry (`VarBytes`) - the byte name of this entry.
     2. Offset (`VarInt`) - the byte offset for this entry in the instruction set.

##### StringEntryPointTable
  1. NumEntries (`VarInt`) - how many entries does this table have.
  2. and then NumEntries of
     1. Entry (`VarString`) - the string at this entry.
     2. Offset (`VarInt`) - the byte offset for this entry in the instruction set.

### Logic File Layout

The logic file contains the general graph flow and expressions. Text that is to be displayed on screen is not in this file as that needs localization.

  - ASCII "JQRDL" - denoting file type (should take 5 bytes)
  - Version (`VarString`) - the bytecode version.
  - Function Table Index (`VarInt`) - Offset (in entire file) of where the function table starts (or 0 if it doesn't exist)
  - Character Table Index (`VarInt`) - Offset (in entire file) of where the character table starts (or 0 if it doesn't exist)
  - Variable Table Index (`VarInt`) - Offset (in entire file) of where the variable table starts (or 0 if it doesn't exist)
  - String Table Index (`VarInt`) - Offset (in entire file) of where the string table starts (or 0 if it doesn't exist)
  - Node Table Index (`VarInt`) - Offset (in entire file) of where the Node table starts
  - Logic Instruction Block Index (`VarInt`) - Offset (in entire file) of where the Instruction table starts
  - Function Table (`StringTable`) - The Function table (if exists)
  - Character Table (`StringTable`) - The Character table (if exists)
  - Variable Table (`StringTable`) - The Variable table (if exists)
  - String Table (`StringTable`) - The String table (if exists)
  - Node Table (`StringEntryPointTable`) - The Node Table (with entry points)
  - Logic Instruction Block - Defined below

#### Logic Instruction Block

This is a large bucket of bytes that is back-to-back opcodes and opcode arguments and defines the actual program flow. Use the Node Table (and a node name) to get your entry point (or alternatley, start at the first instruction). Consume the opcode you are at and proceed accordingly.

### Dialog File Layout

There is one (or more) of these files - each one representing one language. This file should no branching logic or expressions that aren't involved in text display on screen / for subtitling or VO purposes.

  - ASCII "JQRDD" - denoting file type (should take 5 bytes)
  - Version (`VarString`) - the bytecode version
  - Language (`VarString`) - The identifier for this language (be sure to be consistent in your project)
  - Character Table Index (`VarInt`) - Offset (in entire file) of where the character table starts (or 0 if it doesn't exist)
  - String Table Index (`VarInt`) - Offset (in entire file) of where the string table starts (or 0 if it doesn't exist)
  - Dialog Instruction Block Index (`VarInt`) - Offset (in entire file) of where the Dialog Block table starts
  - Character Table (`StringTable`) - The Character table (if exists) - these characters are localized for this language and are in the same order as the logic file
  - String Table (`StringTable`) - The String table (if exists)
  - Dialog Block Table (`BytesEntryPontTable`) - The table of dialog blocks for this language.
  - Dialog Instruction Block - Defined below

#### Dialog Instruction Block

This is a large bucket of bytes that is back-to-back opcodes and opcode arguments and defines text display for a given languagae. Use the Dialog Block table to get your entry point and run until you encounter the `DialogBlockEnd` opcode. 

### Opcodes

Documented [here](https://github.com/StirfireStudios/Jacquard-YarnCompiler/blob/master/src/commands/index.js#L9)

Opcodes are variable length - the opcode itself is always one byte, but the arguments may be more. Types are listed above

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

If you wish to rebuild the documentation, you'll need to have [documentation.js](http://documentation.js.org/) installed, which you can do via `npm install -g documentation` - then you can run `yarn serveDoc` to serve the docs locally or `yarn buildDoc` to build the docs directory