'use strict';

import { Statement } from 'jacquard-yarnparser';

import OptionHandler from './option';
import ConditionalHandler from './conditional';
import * as Commands from '../../commands';

export default function handler(statement) {
	statement.statements.forEach(statement => {
		switch(statement.constructor) {
			case Statement.Option:
				OptionHandler.call(this, statement);
				break;
			case Statement.Conditional:
				ConditionalHandler.call(this, statement);
				break;
			default:
				console.error("Invalid statement type in option group");
				return;
		}
	});

	this.logicCommands.push({
		type: Commands.Names.RunOptions,
		location: statement.location,
	});
}