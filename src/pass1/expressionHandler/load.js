'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';

function handleValueLoad(type, expression) {
	return {
		type: type,
		arg0: expression.value,
		location: expression.location,
	}
}

export default function handle(expression) {
	const instructionList = this.currentCommandList;

	switch(expression.constructor) {
		// These just load a value onto the stack.
		case Expression.BooleanValue:
			instructionList.push({
				type: (expression.value ? Commands.Names.StaticTrue : Commands.Names.StaticFalse),
				location: expression.location,
			});
			break;
		case Expression.FloatValue:
			instructionList.push(handleValueLoad(Commands.Names.StaticFloat, expression));
			break;
		case Expression.IntegerValue:
			instructionList.push(handleValueLoad(Commands.Names.StaticInteger, expression));
			break;
		case Expression.NullValue:
			instructionList.push({
				type: Commands.Names.StaticNull,
				location: expression.location,
			});
			break;
		case Expression.StringValue:
			instructionList.push({
				type: Commands.Names.StaticString,
				string: expression.value,
				location: expression.location,
			});
			break;
		case Expression.Variable:
			instructionList.push({
				type: Commands.Names.VariableLoad,
				name: expression.name,
				location: expression.location,
			});
			break;
		default: 
			console.error("Unknown load expression type");
	}
}
