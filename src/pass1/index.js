'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as DialogSegments from './dialogSegments';

import * as Commands from '../commands';
import { SetupPrivates } from '../classUtils';

import * as Handlers from './statementHandlers';

const privateProps = new WeakMap();

const defaults = {
}

function processStatement(statement) {
	if (statement instanceof Statement.Blank) {
		DialogSegments.FinishCurrent(this);
		return;
	} else if (statement instanceof Statement.Command) {
		DialogSegments.FinishCurrent(this);
		Handlers.Command.call(this, statement);
	} else if (statement instanceof Statement.Conditional) {
		console.log("Conditional");
	} else if (statement instanceof Statement.Evaluate) {
		console.log("Evaluate");
	} else if (statement instanceof Statement.Function) {
		console.log("Function");
	} else if (statement instanceof Statement.LineGroup) {
		console.log("LineGroup");
	} else if (statement instanceof Statement.Link) {
		DialogSegments.FinishCurrent(this);
		Handlers.Link.call(this, statement);
	} else if (statement instanceof Statement.OptionGroup) {
		DialogSegments.FinishCurrent(this);
		console.log("Option Group");
	} else if (statement instanceof Statement.ShortcutGroup) {
		DialogSegments.FinishCurrent(this);
		console.log("Shortcut Group");
	} else if (statement instanceof Statement.Text) {
		Handlers.Text.call(this, statement);
	} else {
		console.error("Unknown")
	}
}

export default class CompilerPass1 {
	constructor() {
		const privates = SetupPrivates(defaults, {});
		privates.state = {
			currentDialog: null,
			logicCommands: [],
			dialogSegments: {},
		};

		privateProps.set(this, privates);
	}

	get logicCommands() { return privateProps.get(this).state.logicCommands; }

	get dialogSegments() { return privateProps.get(this).state.dialogSegments; }

	process(statements) {
		statements = statements.map(item => {return item;});
		const state = privateProps.get(this).state;
		DialogSegments.Setup(state);
		while(statements.length > 0) {
			const statement = statements.shift();
			processStatement.call(state, statement, statements);
		}
		DialogSegments.FinishCurrent(this);
	}
}