'use strict';

import Pass1Compiler from './pass1';

import { SetupPrivates } from './classUtils';

const privateProps = new WeakMap();

const defaultNode = {
	name: null,
	logicCommands: [],
	dialogSegments: {},
}

class CompiledNode {
	constructor(attrs) {
		const privates = SetupPrivates(defaultNode, attrs);

		privateProps.set(this, privates);
	}

	get name() { return privateProps.get(this).name; }

	get logicCommands() { return privateProps.get(this).logicCommands; }

	get dialogSegments() { return privateProps.get(this).dialogSegments; }

	static FromYarnParserNode(node) {
		const pass1Compile = new Pass1Compiler();
		pass1Compile.process(node.statements);

		return new CompiledNode({
			name: node.name,
			logicCommands: pass1Compile.logicCommands,
			dialogSegments: pass1Compile.dialogSegments,
		});
	}
}

export default CompiledNode;