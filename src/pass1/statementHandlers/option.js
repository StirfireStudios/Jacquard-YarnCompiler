'use strict';

import * as Commands from '../../commands';

export default function handler(optionStatement) {
	const optionCommand = {
		type: Commands.Names.PushOption,
		location: optionStatement.location,
	}
	this.logicCommands.push(optionCommand);

	const newBlock = { commands: [] };

	newBlock.commands.push({
		type: Commands.Names.StaticString,
		string: optionStatement.text,
		location: optionStatement.location,
	});
	newBlock.commands.push({
		type: Commands.Names.ShowText,
		location: optionStatement.location,
	});
	newBlock.commands.push({
		type: Commands.Names.ClearArguments,
		arg0: 0,
		arg1: 255,
		location: optionStatement.location,
	});
  newBlock.commands.push({ type: Commands.Names.DialogBlockEnd });

	this.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogBlock: newBlock,
    characterRef: null,
  });

	this.logicCommands.push({
		type: Commands.Names.Jump,
		nodeName: optionStatement.destination,
		location: optionStatement.location,
	});

	optionCommand.index = this.logicCommands.length;
}
