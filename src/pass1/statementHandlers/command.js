'use strict';

import * as Commands from '../../commands';
import handleExpression from '../expressionHandler/index';

export default function handler(statement) {
	statement.arguments.forEach(argument => {
		handleExpression.call(this, argument, true);
	});
  this.logicCommands.push({
		type: Commands.Names.RunCommand,
		location: statement.location,
	});
  this.logicCommands.push({
    type: Commands.Names.ClearArguments,
		arg0: statement.arguments.length,
		location: statement.location,
	});
}