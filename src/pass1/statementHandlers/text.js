'use strict';

import * as DialogSegments from '../dialogSegments'
import * as Commands from '../../commands';

export default function handler(statement) {
	DialogSegments.AddToCurrent(this, {
		type: Commands.Names.StaticString,
		string: statement.text,
	});
}