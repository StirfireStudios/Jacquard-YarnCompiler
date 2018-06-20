'use strict';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'

function createLastJump(logicCommands, location) {
	const lastCommand = logicCommands[logicCommands.length - 1];
	if (lastCommand.type == Commands.Names.Jump) return;
	const returnJump = {type: Commands.Names.Jump, location: location};
	logicCommands.push(returnJump);
	return returnJump;
}

export default function handler(statement) {
	const optionCommand = {
		type: Commands.Names.PushOption, 
		location: statement.location,
	}

	this.logicCommands.push(optionCommand);

	statement.statements.forEach(statement => { this.processStatement(statement);	});
	DialogSegments.FinishCurrent(this);
	const lastJump = createLastJump(this.logicCommands, statement.location);

	optionCommand.index = this.logicCommands.length;

	return lastJump;
}
