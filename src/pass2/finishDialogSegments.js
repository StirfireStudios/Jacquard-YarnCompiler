'use strict';

import * as Commands from '../commands';

function scanForBlocks(commands, blockCommands, usedIDs, needsIDs) {
	commands.forEach(command => {
		if (command.type != Commands.Names.ShowDialogBlock) return;
		blockCommands.push(command);
		const dialogBlock = command.dialogBlock;
		if (dialogBlock.identifier == null) {
			needsIDs.push(dialogBlock);
		} else {
			usedIDs.push(dialogBlock.identifier);
		}
	});
}

function allocateIDs(usedIDs, needsIDs) {
	let currentID = 0;
	needsIDs.forEach(dialogBlock => {
		while(usedIDs.indexOf(currentID) !== -1) currentID++;
		dialogBlock.identifier = currentID;
		usedIDs.push(currentID);
	});
}

function getLength(number) {
	let length = number.toString(16).length;
	return length < 4 ? 4 : length;
}

function setIDs(blockCommands, idLength) {
	const dialogSegments = {};
	blockCommands.forEach(command => {
		command.arg0 = command.dialogBlock.identifier.toString(16).padStart(idLength, "0");
		dialogSegments[command.arg0] = command.dialogBlock.commands;
	});

	return dialogSegments;
}


export default function finishDialogSegments(state) {
	const showBlockCommands = [];
	const usedIDs = [];
	const needsIDs = [];

	scanForBlocks(state.logicCommands, showBlockCommands, usedIDs, needsIDs);
	allocateIDs(usedIDs, needsIDs);

	const maxID = usedIDs.reduce((maxID, currentID) => { return Math.max(maxID, currentID); })
	const maxIDLength = getLength(maxID);

	state.dialogSegments = setIDs(showBlockCommands, maxIDLength);
}
