'use strict';

import { Statement } from 'jacquard-yarnparser';

import * as DialogSegments from './dialogSegments';

import * as Commands from '../commands';
import { SetupPrivates } from '../classUtils';

import * as Handlers from './statementHandlers';

const privateProps = new WeakMap();

const defaults = {
}

function handleFinishingDialogSegment(statement) {
	const textStatement = statement instanceof Statement.Text;
	const lineGroupStatement = statement instanceof Statement.LineGroup;

	if (!(textStatement || lineGroupStatement)) {
		DialogSegments.FinishCurrent(this);
	}	
}

function processStatement(statement) {
	handleFinishingDialogSegment.call(this, statement);

	switch(statement.constructor) {
		case Statement.Command:
			Handlers.Command.call(this, statement);
			break;
	  case Statement.Conditional:
			console.log("Conditional");
			break;
	  case Statement.Evaluate:
			console.log("Evaluate");
			break;
		case Statement.Function:
			console.log("Function");
			break;
		case Statement.LineGroup:
			console.log("LineGroup");
			break;
	  case Statement.Link:
			Handlers.Link.call(this, statement);
			break;
	  case Statement.OptionGroup:
			console.log("Option Group");
			break;
	  case Statement.ShortcutGroup:
			console.log("Shortcut Group");
			break;
		case Statement.Text:
			Handlers.Text.call(this, statement);
			break;
		case Statement.Blank:
			break;
		default:
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