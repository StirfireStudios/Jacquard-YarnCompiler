'use strict';

import * as DialogSegments from '../dialogSegments'
import * as Commands from '../../commands';

export default function handler(statement) {
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.StaticString,
		string: statement.text,
		location: statement.location,
	});
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.ShowText,
		location: statement.location,
	});
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.ClearArguments,
		arg0: 0,
		arg1: 255,
		location: statement.location,
	});
}