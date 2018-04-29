'use strict';

import * as Commands from '../commands';

export default function handler(statement) {
	this.currentDialogCommands.push({
		type: Commands.Names.StaticString,
		string: statement.text,
	});
}