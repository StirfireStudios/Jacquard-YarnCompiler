'use strict';

import * as Commands from '../commands';

function insertOrFindInTable(table, value) {
	let index = table.indexOf(value);
	if (index == -1) {
		index = table.length;
		table.push(value);
	}
	return index;
}

function handleLogicCommand(command) {
	switch(command.type) {
		case Commands.Names.VariableLoad:
		case Commands.Names.VariableSet:
			command.arg0 = insertOrFindInTable(this.variables, command.name);
			delete(command.name);
			break;
		case Commands.Names.StaticString:
			command.arg0 = insertOrFindInTable(this.strings, command.string);
			delete(command.string);
			break;
		case Commands.Names.FunctionReturn:
		case Commands.Names.FunctionReturn:
			command.arg0 = insertOrFindInTable(this.functions, command.name);
			delete(command.name);
			break;
		case Commands.Names.ShowDialogBlock:
			if (command.characterRef === null) {
				command.arg1 = -1;
			} else {
				command.arg1 = insertOrFindInTable(this.characters, command.characterRef);
			}
			delete(command.characterRef);
	}
}

function handleDialogCommand(command) {
	switch(command.type) {
		case Commands.Names.StaticString:
			command.arg0 = insertOrFindInTable(this.dialogStrings, command.string);
			delete(command.string);
			break;		
		case Commands.Names.FunctionReturn:
		case Commands.Names.FunctionReturn:
			command.arg0 = insertOrFindInTable(this.variables, command.string);
			delete(command.name);
			break;
	}
}

export default function pass3(state) {	
	state.logicCommands.forEach(command => {
		handleLogicCommand.call(state, command);
	});

	Object.keys(state.dialogSegments).forEach(name => {
		const dialogSegment = state.dialogSegments[name];
		dialogSegment.forEach(command => {
			handleDialogCommand.call(state, command);
		});
	});

	state.dialogCharacters = state.characters;
}
