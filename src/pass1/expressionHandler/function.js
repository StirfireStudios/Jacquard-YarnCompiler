'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import { InDialogBlock } from '../dialogSegments';

function clean(list, expression, argIndex, count) {
	list.push({
		type: Commands.Names.ClearArguments,
		arg0: argIndex,
		arg1: count,
		location: expression.location,
	});		
}

function execAndClean(list, expression) {
	const command = {
		type: Commands.Names.FunctionReturn,
		name: expression.name,
		arg1: expression.args.length,
		location: expression.location,
	};

	list.push(command);

	for(let i = 0; i < expression.args.length; i++) {
		command[`arg${i + 1}`] = i;
	}

	clean(list, expression, 1, expression.args.length);
}

export default function handle(expression) {
	let list = this.logicCommands;
	if (InDialogBlock(this)) list = this.dialogSegments.current.commands;
	
	expression.args.forEach(arg => { handle.handleExpression.call(this, arg); });

	switch(expression.constructor) {
		case Expression.Function:
			execAndClean(list, expression);
			break;
		default: 
			console.error("Unknown function expression type");
	}
}