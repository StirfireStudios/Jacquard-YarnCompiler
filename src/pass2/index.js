'use strict';

import * as Commands from '../commands';
import HandleDialogBlock from './dialogblock';
import HandleIndexJump from './indexJump';
import HandleNodeJump from './nodeJump';
import { SetupPrivates } from '../classUtils';

const privateState = new WeakMap();

const defaultState = {
	nodeNames: [],
	nodeStarts: [],
	logicCommands: [],
	dialogSegments: {},
	dialogNameIndex: 0,
}

function insertStartNode() {
	this.logicCommands.push({
		type: Commands.Names.NodeEntry,
		arg0: this.currentNodeIndex,
	})
}

function handleCommand(command, dialogSegments) {
	const copiedCommand = Object.assign({}, command);
	switch(copiedCommand.type) {
		case Commands.Names.Jump:
		case Commands.Names.JumpIfTrue:
		case Commands.Names.JumpIfFalse:
			HandleIndexJump.call(this, copiedCommand);
			break;
		case Commands.Names.ShowDialogBlock:
			HandleDialogBlock.call(this, copiedCommand, dialogSegments);
	}
	this.logicCommands.push(copiedCommand);
}

/**
 * This Handles pass 2 compiling which concatenates all the nodes into one long list
 * and builds the start of the node table (for the logic file) and dialog table (for the dialog file)
 */
export default class CompilerPass2 {
	constructor() {
		privateState.set(this, SetupPrivates(defaultState));
	} 

	get nodeNames() { return privateState.get(this).nodeNames; } 

	get nodeStarts() { return privateState.get(this).nodeStarts; }

	get logicCommands() { return privateState.get(this).logicCommands; }

	get dialogSegments() { return privateState.get(this).dialogSegments; }

	add(compiledNode) {
		const state = privateState.get(this);

		if (state.nodeNames.indexOf(compiledNode.name) != -1) {
			console.error("Node already exists in pass2");
			return;
		}

		state.currentNode = {
			name: compiledNode.name,
			startIndex: state.logicCommands.length,
			tableIndex: state.nodeStarts.length,
		}

		state.nodeNames.push(compiledNode.name);
		state.nodeStarts.push(state.currentNode.startIndex);
		
		insertStartNode.call(state);

		// we do this here, after we've inserted anything required for node start
		state.currentNode.logicOffset = state.logicCommands.length; 
		compiledNode.logicCommands.forEach(command => {
			handleCommand.call(state, command, compiledNode.dialogSegments);
		});
	}

	finish() {
		privateState.get(this).logicCommands.forEach(command => {
			if (command.type == Commands.Names.Jump) HandleNodeJump.call(this, command);
		});		
	}
}