'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';

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
	const list = this.currentCommandList;

	if (expression instanceof Expression.NegativeOperator) {
		list.push({
			type: Commands.StaticInteger,
			value: 0,
			location: expression.location,
		});
	}

	if (expression.right != null) {
		handle.handleExpression.call(this, expression.right, true);
	} else if (expression.variables != null && expression.variables.length > 0) {
		list.push({
			type: Commands.Names.VariableLoad,
			name: expression.variables[0],
			location: expression.location,
		});
	}

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
