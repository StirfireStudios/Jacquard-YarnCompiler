'use strict';

import * as Commands from '../commands';
import FinishDialogSegments from './finishDialogSegments';
import HandleIndexJump from './indexJump';
import HandleNodeJump from './nodeJump';

function insertStartNode() {
	this.logicCommands.push({
		type: Commands.Names.NodeEntry,
		arg0: this.currentNode.tableIndex,
	});
}

function insertEndNode() {
	this.logicCommands.push({
		type: Commands.Names.StopExecution,
	});
}

function handleCommand(command) {
	const copiedCommand = Object.assign({}, command);
	switch(copiedCommand.type) {
		case Commands.Names.PushOption:
		case Commands.Names.Jump:
		case Commands.Names.JumpIfTrue:
		case Commands.Names.JumpIfFalse:
			HandleIndexJump.call(this, copiedCommand);
			break;
		case Commands.Names.ShowDialogBlock:
			this.showDialogCommands.push(copiedCommand);
	}
	this.logicCommands.push(copiedCommand);
}

/**
 * This Handles pass 2 compiling which concatenates all the nodes into one long list
 * and builds the start of the node table (for the logic file) and dialog table (for the dialog file)
 */
export function add(state, pass1Output) {
	if (state.dialogNameIndex == undefined) state.dialogNameIndex = -1;
	if (state.dialogNameMaxLength == undefined) state.dialogNameMaxLength = 0;
	if (state.showDialogCommands == undefined) state.showDialogCommands = [];
	if (state.nodeNames.indexOf(pass1Output.name) != -1) {
		console.error("Node already exists in pass2");
		return;
	}

	state.currentNode = {
		name: pass1Output.name,
		startIndex: state.logicCommands.length,
		tableIndex: state.nodeStarts.length,
	}

	state.nodeNames.push(pass1Output.name);
	state.nodeStarts.push(state.currentNode.startIndex);
	
	insertStartNode.call(state);

	// we do this here, after we've inserted anything required for node start
	state.currentNode.logicOffset = state.logicCommands.length; 
	pass1Output.logicCommands.forEach(command => {
		handleCommand.call(state, command);
	});

	insertEndNode.call(state);
}

export function finish(state) {
	state.logicCommands.forEach(command => {
		if (command.type == Commands.Names.Jump) HandleNodeJump.call(state, command);
	});

	FinishDialogSegments(state);

	delete(state.dialogNameIndex);
	delete(state.dialogNameMaxLength);
	delete(state.showDialogCommands);
}
