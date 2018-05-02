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
		case Statement.Shortcut:
			Handlers.Shortcut.call(this, statement);
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


function setupState() {
	return {
		currentDialog: null,
		logicCommands: [],
		dialogSegments: {},
	};
}

/**
 * This Handles pass 1 compiling which just unrolls all the nested statements 
 * into a continous list of commands.
 * Jump instructions are either referencing command indexes or node names
 * function, variable and string references are still referencing the names.
 * This is desiggned to run on one node at a time.
 */
export default function Pass1(node) {
	const state = setupState();
	state.name = node.name;
	state.processStatement = processStatement.bind(state);
	DialogSegments.Setup(state);
	node.statements.forEach(statement => { 
		processStatement.call(state, statement, node.statements);
	});
	DialogSegments.FinishCurrent(state);

	delete(state.processStatement);
	delete(state.currentDialog);
	return state;
}