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

function rightAndClean(list, expression, type, argIndex, leaveArgs) {
	list.push({
		type: type,
		arg0: argIndex,
		location: expression.location,
	});
	if (!leaveArgs) clean(list, expression, argIndex + 1, 1);
}

function leftRightAndClean(list, expression, type, argIndex, leaveArgs) {
	list.push({
		type: type,
		arg0: argIndex + 1,
		arg1: argIndex,
		location: expression.location,
	});
	if (!leaveArgs) clean(list, expression, argIndex + 1, 2);
}

export default function handle(expression) {
	let list = this.logicCommands;
	if (InDialogBlock(this)) list = this.dialogSegments.current.commands;

	if (expression instanceof Expression.NegativeOperator) {
		list.push({
			type: Commands.StaticInteger,
			value: 0,
			location: expression.location,
		});
	}

	// index 0
	handle.handleExpression.call(this, expression.right, true);

	switch(expression.constructor) {
		case Expression.NotOperator:
			rightAndClean(list, expression, Commands.Names.Not, 0);
			break;
		case Expression.NegativeOperator:
  		leftRightAndClean(list, expression, Commands.Names.Subtract, 0);
		default: 
			console.error("Unknown right expression type");
	}
}