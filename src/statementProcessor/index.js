'use strict';

import * as Commands from '../commands';
import { Statement } from 'jacquard-yarnparser';
import textHandler from './text';

const privateProps = new WeakMap();

const defaults = {
	commands: [],
	currentDialogCommands: [],
	dialogParts: {},
	sourceMap: [],
}

function getDefaults() {
	return Object.assign({}, defaults);
}

function processStatement(statement) {
	if (statement instanceof Statement.Blank) {
		return;
	} else if (statement instanceof Statement.Command) {
		console.log("Command");
	} else if (statement instanceof Statement.Conditional) {
		console.log("Conditional");
	} else if (statement instanceof Statement.Evaluate) {
		console.log("Evaluate");
	} else if (statement instanceof Statement.Function) {
		console.log("Function");
	} else if (statement instanceof Statement.LineGroup) {
		console.log("LineGroup");
	} else if (statement instanceof Statement.Link) {
		console.log("Link");
	} else if (statement instanceof Statement.OptionGroup) {
		console.log("Option Group");
	} else if (statement instanceof Statement.ShortcutGroup) {
		console.log("Shortcut Group");
	} else if (statement instanceof Statement.Text) {
		textHandler.call(this, statement);
	} else {
		console.error("Unknown")
	}
}

export default class StatementProcessor {
	constructor() {
		const privates = Object.assign(getDefaults(), attrs);
		privateProps.set(this, privates);
	}

	get commands() { return privateProps.get(this).commands; }

	get dialogPartNames() { return Object.keys(privateProps.get(this).dialogParts); }

	dialogPart(name) { return privateProps.get(this).dialogParts[name]; }

	process(statements) {
		while(statements.length > 0) {
			const statement = statements.unshift();
			processStatement.call(this, statement, statements);
		}
	}
}