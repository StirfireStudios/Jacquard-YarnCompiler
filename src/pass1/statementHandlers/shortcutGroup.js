'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'
import ShortcutHandler from './shortcut';
import ConditionalHandler from './conditional';

export default function handler(statement) {
	statement.statements.forEach(statement => {
		switch(statement.constructor) {
			case Statement.Shortcut:
  			ShortcutHandler.call(this, statement);
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
}