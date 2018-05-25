'use strict';

import Commands from './commands';
import CompilerState from './compilerState';
import Pass1 from './pass1';
import * as Pass2 from './pass2';
import Pass3 from './pass3';
import Pass4 from './pass4';
import Pass5 from './pass5';
import * as Writer from './writer';

const privateProps = new WeakMap();

/**
 * Compiler configuration
 * @class CompilerConfig
 */
const defaultConfig = {
	/** Should the compiler insert a debug node if an unknown node was linked to.
	 * Defaults to true
	 * @type {boolean}
	 * @default true
	 *  @memberof CompilerConfig */
	errorIfNodeUndefined: true,
}

function resetState(privates) {
	privates.state.reset();
	privates.linkingRequired = true;
}

function addMessage(type, message) {
	const array = privateProps.get(this)[type];
	array.push(message);
}

function addWarning(message) { addMessage.call(this, "warnings", message); }

function addError(message) { addMessage.call(this, "errors", message); }

function checkNodeDefinition(name) {
	const privates = privateProps.get(this);

	const nodeExists = privates.compiledNodes[name] != null;
	const nodeWasBlank = privates.undefinedNodes[name] != null;
	if (!nodeExists) return;
	if (nodeExists && nodeWasBlank) return;
	this.addWarning(`${name} already existed, overwriting`);
}

function validateWriteStreams(logicStream, dialogueStream, sourceMapStream, debugStream) {
	if (logicStream == null) throw new Error("Logic stream not supplied");
	if (dialogueStream == null) throw new Error("Dialogue stream not supplied");
	if (logicStream.write == null) throw new Error("Logic stream not writable");
	if (dialogueStream.write == null) throw new Error("Dialogue stream not writable");
	if ((sourceMapStream != null) && (sourceMapStream.write == null))
		throw new Error("SourceMap stream not writable")
	if ((debugStream != null) && (debugStream.write == null))
		throw new Error("Debug stream not writable");

}

/** Instance of this class are used to compile a yarn AST output by the YarnParser
 * @param {CompilerConfig} config the configuration for this compiler
 */
export class Compiler {
	constructor(config) {
		const privates = {
			config: Object.assign({}, defaultConfig),
		}

		privates.state = new CompilerState();

		privateProps.set(this, privates);
	}

	/** process the AST currently in the specified YarnParser
	 * @param {YarnParser} yarnParser 
	 * @return {boolean} if there was an error processing the nodes in this yarnparser
	 */
	process(yarnParser) {
		const privates = privateProps.get(this);
		const config = privates.config;
		const state = privates.state;
		const errorCount = state.errors.length;

		state.linkingRequired = true;

		// pass 1 and 2 - generate command lists and concatenate all nodes together;
		yarnParser.nodeNames.forEach((name) => {
			const yarnNode = yarnParser.nodeNamed(name);
			Pass2.add(state, Pass1(yarnNode));
		});
		Pass2.finish(state);

		Pass3(state);

		return state.errors.length != errorCount;
	}

	/** Link and finalize assembly of the bytecode ready for writing.
	 * (Passes 4, 5 and 6)
	 */
	assemble() {
		const state = privateProps.get(this).state;
		if (!state.linkingRequired) return;		

		Pass4(state);
		Pass5(state);
		state.linkingRequired = false;
	}

	/**
 	 * Write the assembled file out to the supplied streams.
	 * @param {stream.Writable} logicStream - the logic bytecode stream
	 * @param {stream.Writable} dialogueStream - the "default" language dialogue stream
	 * @param {stream.Writable} sourceMapStream  - the sourcemap stream (if null, won't be writte)
	 * @param {stream.Writable} debugStream - the debug stream (if null, won't be written)
	 * @returns {Promise} - when this is completed
	 */
	writeBytecode(logicStream, dialogueStream, sourceMapStream, debugStream) {
		validateWriteStreams(logicStream, dialogueStream, sourceMapStream, debugStream);
		return Writer.Stream.call(
			privateProps.get(this).state, 
			logicStream, dialogueStream, sourceMapStream, debugStream,
		);
	}

	/**
	 * Write the bytecode as buffers
	 * @param {boolean} includeSourceMap - if the buffer object includes a sourcemap
	 * @param {boolean} includeDebug - if the buffer object includes a debug text file
	 * @returns {Promise} - when this is completed. 
	 * The promise's resolve will have an argument that is a BufferObj containing 
	 * the compiled bytecode
	 */
	writeBuffers(includeSourceMap, includeDebug) {
		return Writer.Buffers.call(privateProps.get(this).state, includeSourceMap, includeDebug);
	}

	/** Reset the state of this Compiler
	 */
	reset() {
		resetState(privateProps.get(this))
	}
}

/**
 * Buffer return object
 * @class BufferObj
 */

/** The Logic buffer
 * @instance
 * @name BufferObj.logic
 * @type {Buffer}
 * @memberof BufferObj */

/** The Dialogue buffer
 * @instance
 * @name BufferObj.dialogue
 * @type {Buffer}
 * @memberof BufferObj */

/** The SourceMap json. Only valid if includeSourceMap is true
 * @instance
 * @name BufferObj.sourceMap
 * @type {Object}
 * @memberof BufferObj */

/** The Debug text files. Only valid if includeDebug is true
 * @instance
 * @name BufferObj.debug
 * @type {string[]}
 * @memberof BufferObj */

export {default as Commands} from './commands';
