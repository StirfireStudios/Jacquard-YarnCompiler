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
			Handlers.Conditional.call(this, statement);
			break;
		case Statement.Evaluate:
			Handlers.Evaluate.call(this, statement);
			break;
		case Statement.Function:
			Handlers.Function.call(this, statement);
			break;
		case Statement.LineGroup:
			Handlers.LineGroup.call(this, statement)
			break;
	  case Statement.Link:
			Handlers.Link.call(this, statement);
			break;
		case Statement.Option:
			Handlers.Option.call(this, statement);
			break;
		case Statement.OptionGroup:
			Handlers.OptionGroup.call(this, statement);
			break;
	  case Statement.ShortcutGroup:
			Handlers.ShortcutGroup.call(this, statement);
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
		const state = privateProps.get(this).state;
		state.processStatement = processStatement.bind(state);
		DialogSegments.Setup(state);
		statements.forEach(statement => { 
			processStatement.call(state, statement, statements);
		});
		DialogSegments.FinishCurrent(this);
	}
}