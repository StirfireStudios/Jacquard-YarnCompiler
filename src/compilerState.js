'use strict';

export default class CompilerState {
	constructor() {
		this.reset();
	}
	
	reset() {
		this.nodeNames = [];
		this.characters = [];
		this.functions = [];
		this.variables = [];
		this.strings = [];
		this.nodeStarts = [];
		this.logicCommands = [];
		this.dialogSegments = {};
		this.dialogCharacters = [];
		this.dialogStrings = [];
		this.errors = [];
		this.warnings = [];
		this.linkingRequired = true;
		this.logicHeaders = {};
		this.logicCommandBuffers = [];
		this.dialogHeaders = {};
		this.dialogCommandBuffers = [];
	}
}
