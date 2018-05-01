'use strict';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'

export default function handler(optionStatement) {
	const optionCommand = {
		type: Commands.Names.PushOption,
		location: optionStatement.location,
	}

	this.logicCommands.push(optionCommand);

	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.StaticString,
		string: optionStatement.text,
		location: optionStatement.location,
	});
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.ShowText,
		location: optionStatement.location,
	});
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.ClearArguments,
		arg0: 1,
		location: optionStatement.location,
	});
	DialogSegments.FinishCurrent(this);
	this.logicCommands.push({
		type: Commands.Names.Jump,
		nodeName: optionStatement.destination,
		location: optionStatement.location,
	});

	optionCommand.index = this.logicCommands.length;
}