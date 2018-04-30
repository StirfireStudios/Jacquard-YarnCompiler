'use strict';

import { Expression } from 'jacquard-yarnparser';

import handleAssignment from './assignment';
import handleFunction from './function';
import handleLoad from './load';
import handleLeftRight from './leftRight';
import handleRight from './rightOnly';

export default function handleExpression(expression) {
	switch(expression.constructor) {
		// These just load a value onto the stack.
		case Expression.BooleanValue:
		case Expression.FloatValue:
		case Expression.IntegerValue:
		case Expression.NullValue:
		case Expression.StringValue:
		case Expression.Variable:
			handleLoad.call(this, expression);
			break;
		// these need a value from the stack
		case Expression.NotOperator:
			handleRight.call(this, expression);
			break;
		case Expression.NegativeOperator:
			handleRight.call(this, expression);
			break;
			// these need 2 values from the stack
		case Expression.AndOperator:
		case Expression.EqualityOperator:
		case Expression.GreaterThanOperator:
		case Expression.GreaterThanOrEqualOperator:
		case Expression.LessThanOperator: 
		case Expression.LessThanOrEqualOperator: 
		case Expression.NotEqualityOperator:
		case Expression.OrOperator:
		case Expression.XorOperator:
		case Expression.AddOperator:
		case Expression.SubtractOperator: 
		case Expression.DivideOperator: 
		case Expression.MultiplyOperator: 
		case Expression.ModulusOperator:
			handleLeftRight.call(this, expression);
			break;
		// assignment
		case Expression.AssignmentOperator:
		case Expression.AddAssignOperator:
		case Expression.AssignOperator: 
		case Expression.DivideAssignOperator:
		case Expression.ModulusAssignOperator:
		case Expression.MultiplyAssignOperator:
		case Expression.SubtractAssignOperator:
			handleAssignment.call(this, expression);
			break;	
		case Expression.Function:
			handleFunction.call(this, expression);
			break;
	}
}

handleAssignment.handleExpression = handleExpression;
handleFunction.handleExpression = handleExpression;
handleLeftRight.handleExpression = handleExpression;
handleRight.handleExpression = handleExpression; 
