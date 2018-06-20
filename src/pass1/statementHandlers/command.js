'use strict';

import * as Commands from '../../commands';
import handleExpression from '../expressionHandler/index';

export default function handler(statement) {
	let list = this.currentCommandList;

	statement.arguments.forEach(argument => {
		handleExpression.call(this, argument, true);
	});
  list.push({
		type: Commands.Names.RunCommand,
		location: statement.location,
	});
  list.push({
		type: Commands.Names.ClearArguments,
		arg0: 0,
		arg1: 255,
		location: statement.location,
	});
}
