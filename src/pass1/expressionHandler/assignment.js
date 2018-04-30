'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import { InDialogBlock } from '../dialogSegments';

function assign(list, expression) {
	list.push({
		type: Commands.Names.VariableSet,
		name: expression.variable.name,
		location: expression.location,
	});
}

function clean(list, expression, argIndex, count) {
	list.push({
		type: Commands.Names.ClearArguments,
		arg0: argIndex,
		arg1: count,
		location: expression.location,
	});		
}

function execAndAssign(list, expression, type) {
	list.push({
		type: Commands.Names.VariableLoad,
		name: expression.variable.name,
		location: expression.location,
	});
	list.push({
		type: type,
		arg0: 0,
		arg1: 1,
		location: expression.location,
	});
	assign(list, expression);
	clean(list, expression, 0, 2);
}

export default function handle(expression) {
	let list = this.logicCommands;
	if (InDialogBlock(this)) list = this.dialogSegments.current.commands;

	// index 0
	handle.handleExpression.call(this, expression.expression);

	switch(expression.constructor) {
		case Expression.AddAssignOperator:
			execAndAssign(list, expression, Commands.Names.Add);
			break;
		case Expression.AssignOperator: 
			assign(list, expression);
			clean(list, expression, 0, 1);
			break;
		case Expression.DivideAssignOperator:
			execAndAssign(list, expression, Commands.Names.Divide);
			break;
		case Expression.ModulusAssignOperator:
			execAndAssign(list, expression, Commands.Names.Modulus);
			break;
		case Expression.MultiplyAssignOperator:
			execAndAssign(list, expression, Commands.Names.Multiply);
			break;
		case Expression.SubtractAssignOperator:
			execAndAssign(list, expression, Commands.Names.Subtract);
			break;
		default: 
			console.error("Unknown assign expression type");
	}
}