const fs = require('fs');
const Path = require('path');

const FileIO = require('./FileIO');

const package = require('./package.json')
const program = require('commander');

const YarnParser = require('jacquard-yarnparser').Parser;

const YarnCompiler = require('./dist/index').Compiler;

program
  .version(package.version)
  .arguments('<infile/indir>', '<outdir>')
  .parse(process.argv);

const config = {
  ready: true,
  outputHelp: false,
  inputIsDir: false,
  inputFiles: [],
}

if (program.args.length < 1) {
  console.error('Input file not specified');
  config.ready = false;
  config.outputHelp = true;
} else {
  const path = program.args[0];
  const fileType = FileIO.PathType(path);
  switch(fileType) {
    case FileIO.FileType.None:
      console.error(`input file doesn't exist`);
      config.ready = false;
      break;
    case FileIO.FileType.Other:
      console.error(`input file is not a directory or file`);
      config.ready = false;
      break;
    case FileIO.FileType.File:
      config.inputFiles = [program.args[0]]
      config.inputIsDir = false;
      break;
    case FileIO.FileType.Directory:
      config.inputIsDir = true;
      config.inputFiles = FileIO.YarnFilesInDir(path);
      if (config.inputFiles.length == 0) {
        console.error(`input directory contains no yarn files`);
        config.ready = false;
      }
      break;
  }
}

if (program.args.length < 2) {
  console.error('output dir not specified');
  config.ready = false;
  config.outputHelp = true;
} else {
  const path = program.args[1];
  const fileType = FileIO.PathType(path);  
  switch(fileType) {
    case FileIO.FileType.None:
      fs.mkdir(path);
    case FileIO.FileType.Directory:
      config.outputDir = path;
      break;
    default:
      console.error("output location exists and isn`t a directory");
      config.ready = false;
  }  
}

if (!config.ready) {
  if (config.outputHelp) {
    program.help();
  } else {
    return -1;
  }
}

parser = new YarnParser({
  preprocessOnly: config.preprocessOutputFiles != null,
  preprocessDebug: config.preprocessDebug
});

for(let fileIndex = 0; fileIndex < config.inputFiles.length; fileIndex++) {
  const inputPath = config.inputFiles[fileIndex];
  let yarnText = null;
  try {
    yarnText = FileIO.ReadEntireFile(inputPath);
  } catch(err) {
    console.error(`Could not read ${config.filename} - ${err}`);
    continue;
  }

  if (parser.parse(yarnText, config.bodyOnly, inputPath)) {
    console.error(`Could not parse ${inputPath}`)
    parser.errors.forEach((error) => {
      console.error(`Error: ${error}`);
		})
		return;
  }
}

compiler = new YarnCompiler({sourceMap: true, debug: true});
compiler.process(parser);
compiler.assemble();

try {
  const logicOutputPath = Path.join(config.outputDir, "output.jqrdl");
  const dialogueOutputPath = Path.join(config.outputDir, "output.jqrdd");
  const debugOutputPath = Path.join(config.outputDir, "output.jqrd.debug");
  const sourceMapPath = Path.join(config.outputDir, "output.jqrd.sourcemap");

  const logic = FileIO.OpenFileWriteStream(logicOutputPath);
  const dialogue = FileIO.OpenFileWriteStream(dialogueOutputPath);
  const debug = FileIO.OpenFileWriteStream(debugOutputPath);
  const sourceMap = FileIO.OpenFileWriteStream(sourceMapPath);

  let completed = false;

  const closeFiles = function() {
    FileIO.FinishWriteStream(logic);
    FileIO.FinishWriteStream(dialogue);
    FileIO.FinishWriteStream(sourceMap);
    FileIO.FinishWriteStream(debug);
    completed = true;
  }

  compiler.writeBytecode(logic, dialogue, sourceMap, debug).then(() => {
    closeFiles();
    console.log("Files succesfully compiled and written");
  }, (error) => {
    console.error(`Could not write files - ${error}`);
    closeFiles();
  });

  const waitLoop = function() {
    if (!completed) setTimeout(waitLoop, 10);
  }
  waitLoop();
} catch(err) {
  console.error(`Could not write files - ${err}`);
}