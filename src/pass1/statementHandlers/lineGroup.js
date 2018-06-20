'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import CommandHandler from './command';
import ExpressionHandler from '../expressionHandler';

function handleSubStatement(statement) {
	switch(statement.constructor) {
		case Statement.Text:
			this.currentCommandList.push({
				type: Commands.Names.StaticString,
				string: statement.text,
				location: statement.location,
			});
			break;
		case Statement.Evaluate:
			ExpressionHandler.call(this, statement.expression);
			break;
		case Statement.Command:
			CommandHandler.call(this, statement);
			break;
		default:
			console.error("Unknown substatement for a linegroup");
			return;
	}
}

export default function handler(statement) {
	const subStatements = statement.statements;
	subStatements.forEach((subStatement) => {
		handleSubStatement.call(this, subStatement);
	});
	this.currentCommandList.push({
		type: Commands.Names.ShowText,
		location: statement.location,
	});
	this.currentCommandList.push({
		type: Commands.Names.ClearArguments,
		arg0: 0,
		arg1: 255,
		location: statement.location,
	});
}
