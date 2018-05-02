'use strict';

export default class CompilerState {
	constructor() {
		this.reset();
	}
	
	reset() {
		this.nodeNames = [];
		this.nodeStarts = [];
		this.logicCommands = [];
		this.dialogSegments = {};
		this.errors = [];
		this.warnings = [];
		this.linkingRequired = true;		
	}
}
