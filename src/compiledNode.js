'use strict';

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
}

export default CompiledNode;