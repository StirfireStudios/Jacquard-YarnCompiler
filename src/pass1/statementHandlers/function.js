'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import ExpressionHandler from '../expressionHandler';
import { InDialogBlock } from '../dialogSegments';

export default function handle(statement) {
	let list = this.logicCommands;
	if (InDialogBlock(this)) list = this.dialogSegments.current.commands;

	const args = statement.arguments;

	args.forEach(arg => { ExpressionHandler.call(this, arg); });

	const command = {
		type: Commands.Names.FunctionNoReturn,
		name: statement.name,
		arg1: args.length,
		location: statement.location,
	};

	list.push(command);

	for(let i = 0; i < args.length; i++) {
		command[`arg${i + 1}`] = i;
	}

	list.push({
		type: Commands.Names.ClearArguments,
		arg0: 0,
		arg1: args.length,
		location: statement.location,
	});
}