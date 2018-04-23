'use strict';

const Commands = require('./index');
const Statement = require('jacquard-yarnparser').Statement;

function processor(commandList, sourceMaps, statement) {
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
		console.log("Text");
	} else {
		console.error("Unknown")
	}
}

module.exports = processor;