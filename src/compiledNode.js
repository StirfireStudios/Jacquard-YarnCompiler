'use strict';

const privateProps = new WeakMap();

const defaultNode = {
	name: null,
	commands: [],
	sourceMap: []
}

function getDefaultNode() {
	return Object.assign({}, defaultNode);
}

class CompiledNode {
	constructor(attrs) {
		const privates = Object.assign(getDefaultNode(), attrs);
		privateProps.set(this, privates);
	}

	get name() { return privateProps.get(this).name; }

	get commands() { return privateProps.get(this).commands; }

	get sourceMap() { return privateProps.get(this).sourceMap; }

	static FromYarnParserNode(node) {
		
		const compiledNode = new CompiledNode();
		const privates = privateProps.get(compiledNode);
		privates.name = node.name;
		const commands = privates.commands;
		const sourceMap = privates.sourceMap;

		const statements = node.statements;
		while(statements.length > 0) {
			const statement = statements.shift();
			statementProcessor(commands, sourceMap, statement);
		}

		return compiledNode;
	}
}

export default CompiledNode;