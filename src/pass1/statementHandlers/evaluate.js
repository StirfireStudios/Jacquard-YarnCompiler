'use strict';

import { Expression } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import ExpressionHandler from '../expressionHandler';
import { InDialogBlock } from '../dialogSegments';

export default function handle(statement) {
	ExpressionHandler.call(this, statement.expression);

	let list = this.currentCommandList;
	if (!statement.returnOutput) {
		list.push({
			type: Commands.Names.ClearArguments,
			arg0: 0,
			arg1: 1,
			location: statement.location,
		});
	}
}
