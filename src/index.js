'use strict';

import CompiledNode from './compiledNode';
import Commands from './commands';

const privateProps = new WeakMap();

/**
 * Compiler configuration
 * @class CompilerConfig
 */
const defaultConfig = {
	/** Should this compiler output a sourcemap. Defaults to false.
	 * @type {boolean}
	 * @default false
	 * @memberof CompilerConfig */
	sourceMap: false,
	/** Should this compiler output a text file containing information on the 
	 * compiled source. Defaults to false.
	 * @type {boolean}
	 * @default false
	 * @memberof CompilerConfig */
	debug: false,
	/** Should the compiler insert a debug node if an unknown node was linked to.
	 * Defaults to true
	 * @type {boolean}
	 * @default true
	 *  @memberof CompilerConfig */
	errorIfNodeUndefined: true,
}

function resetState(privates) {
	privates.errors = [];
	privates.warnings = [];
	privates.compiledNodes = {};
	privates.undefinedNodes = {};
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

/** Instance of this class are used to compile a yarn AST output by the YarnParser
 * @param {CompilerConfig} config the configuration for this compiler
 */
export class Compiler {
	constructor(config) {
		const privates = {
			config: Object.assign({}, defaultConfig),
		}

		resetState(privates);

		privateProps.set(this, privates);
	}

	/** process the AST currently in the specified YarnParser
	 * @param {YarnParser} yarnParser 
	 * @return {boolean} if there was an error processing the nodes in this yarnparser
	 */
	process(yarnParser) {
		const privates = privateProps.get(this);
		const errorCount = privates.errors.length;

		privates.linkingRequired = true;

		yarnParser.nodeNames.forEach((name) => {
			checkNodeDefinition.call(this, name);
			const yarnNode = yarnParser.nodeNamed(name);
			privates.compiledNodes[name] = CompiledNode.FromYarnParserNode(yarnNode);
		});

		return privates.errors.length != errorCount;
	}

	/** Reset the state of this Compiler
	 */
	reset() {
		resetState(privateProps.get(this))
	}
}

export {default as Commands} from './commands';
export {default as CompiledNode} from './compiledNode';