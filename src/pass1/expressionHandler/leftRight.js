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
	const list = this.currentCommandList;

	// index 1
	handle.handleExpression.call(this, expression.left, true);
	// index 0
	handle.handleExpression.call(this, expression.right, true);

	switch(expression.constructor) {
		// simple left-right stuff
		case Expression.AndOperator:
			leftRightAndClean(list, expression, Commands.Names.And, 0);
			break;
		case Expression.EqualityOperator:
			leftRightAndClean(list, expression, Commands.Names.Equal, 0);
			break;
		case Expression.GreaterThanOperator:
			leftRightAndClean(list, expression, Commands.Names.GreaterThan, 0);
			break;
		case Expression.LessThanOperator: 
			leftRightAndClean(list, expression, Commands.Names.LessThan, 0);
			break;
		case Expression.OrOperator:
			leftRightAndClean(list, expression, Commands.Names.Or, 0);
			break;
		case Expression.XorOperator:
			leftRightAndClean(list, expression, Commands.Names.Xor, 0);
			break;
		case Expression.AddOperator:
			leftRightAndClean(list, expression, Commands.Names.Add, 0);
			break;
		case Expression.SubtractOperator: 
			leftRightAndClean(list, expression, Commands.Names.Subtract, 0);
			break;
		case Expression.DivideOperator: 
			leftRightAndClean(list, expression, Commands.Names.Divide, 0);
			break;
		case Expression.MultiplyOperator: 
			leftRightAndClean(list, expression, Commands.Names.Multiply, 0);
			break;		
		case Expression.ModulusOperator:
			leftRightAndClean(list, expression, Commands.Names.Modulus, 0);
			break;
		// special cases
		case Expression.GreaterThanOrEqualOperator:
			leftRightAndClean(list, expression, Commands.Names.GreaterThan, 0, true);
			leftRightAndClean(list, expression, Commands.Names.Equal, 1, true);
			leftRightAndClean(list, expression, Commands.Names.Or, 0, true);
			clean(list, expression, 1, 4);
			break;
		case Expression.LessThanOrEqualOperator: 
			leftRightAndClean(list, expression, Commands.Names.LessThan, 0, true);
			leftRightAndClean(list, expression, Commands.Names.Equal, 1, true);
			leftRightAndClean(list, expression, Commands.Names.Or, 0, true);
			clean(list, expression, 1, 4);
			break;
		case Expression.NotEqualityOperator:
			leftRightAndClean(list, expression, Commands.Names.Equal, 0);
			rightAndClean(list, expression, Commands.Names.Not, 0);
			break;
		default: 
			console.error("Unknown leftright expression type");
	}
}
