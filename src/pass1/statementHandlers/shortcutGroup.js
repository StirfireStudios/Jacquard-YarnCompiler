'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'
import ShortcutHandler from './shortcut';
import ConditionalHandler from './conditional';

export default function handler(statement) {
	const jumpReturns = [];
	statement.statements.forEach(statement => {
		switch(statement.constructor) {
			case Statement.Shortcut:
				const jumpReturn = ShortcutHandler.call(this, statement);
				if (jumpReturn != null) jumpReturns.push(jumpReturn);
				break;
			case Statement.Conditional:
				ConditionalHandler.call(this, statement);
				break;
			default:
				console.error("Invalid statement type in shortcut group");
				return;
		}
	});

	this.logicCommands.push({
		type: Commands.Names.RunOptions,
		location: statement.location,
	});

	jumpReturns.forEach((jumpReturn) => { 
		jumpReturn.index = this.logicCommands.length;
	});
}
