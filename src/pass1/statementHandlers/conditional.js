'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as Commands from '../../commands';
import * as DialogSegments from '../dialogSegments'
import handleExpression from '../expressionHandler/index';

function insertTestIfPresent(clause) {
	if (clause.test == null) return null;

	handleExpression.call(this, clause.test);

	const testJump = { type: Commands.Names.JumpIfFalse };
	this.logicCommands.push(testJump);
	return testJump;
}

function finishTestJump(testJump) {
	if (testJump === null) return;
	testJump.index = this.logicCommands.length;
}

export default function handler(statement) {
	const endJumps = [];
	let testJump = null;
	statement.clauses.forEach(clause => {
		const testJump = insertTestIfPresent.call(this, clause);
		clause.statements.forEach(statement => {
			this.processStatement(statement);
		});

		const endJump = {
			type: Commands.Names.Jump,
			index: -1,
			location: statement.location,
		}
		endJumps.push(endJump);
		this.logicCommands.push(endJump);
		finishTestJump.call(this, testJump);
	});
	endJumps.forEach(jump => { jump.index = this.logicCommands.length; });
}
