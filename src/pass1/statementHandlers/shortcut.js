'use strict';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'

export default function handler(statement) {
	const optionCommand = {
		type: Commands.Names.PushOption, 
		location: statement.location,
	}

	this.logicCommands.push(optionCommand);

	statement.statements.forEach(statement => { this.processStatement(statement);	});
	DialogSegments.FinishCurrent(this);

	optionCommand.index = this.logicCommands.length;
}