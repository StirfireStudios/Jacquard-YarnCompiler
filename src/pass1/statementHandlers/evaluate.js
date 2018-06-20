'use strict';

import * as Commands from '../../commands';
import ExpressionHandler from '../expressionHandler';

export default function handle(statement) {
	ExpressionHandler.call(this, statement.expression);

	if (!statement.returnOutput) {
		this.currentCommandList.push({
			type: Commands.Names.ClearArguments,
			arg0: 0,
			arg1: 1,
			location: statement.location,
		});
	}
}
