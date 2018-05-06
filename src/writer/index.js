'use strict';

const VERSION = '0.1.0';
const Language = "EN-au"; 

import writeLogicHeaders from './logicHeaders';
import writeDialogueHeaders from './dialogueHeaders';
import * as DebugUtils from './debugUtils';

function writeLogicBuffers(stream, sourceMap, debugStream) {
	for(let index = 0; index < this.logicCommandBuffers.length; index++) {
		const command = this.logicCommands[index];
		const buffer = this.logicCommandBuffers[index];

	}
}

function writeDialogBuffers(stream, sourceMap, debugStream) {
	for(let index = 0; index < this.dialogCommandBuffers.length; index++) {
		const buffer = this.dialogCommandBuffers[index];
		
	}
}

export default function write(logicStream, dialogueStream, sourceMapStream, debugStream) {	
	return new Promise((resolve, reject) => {
		const state = {
			sourceMapData: null,
			debugData: null,
			version: VERSION, 
			language: Language,
			state: this,			
		}
		if (sourceMapStream != null) state.sourceMapData = {};
		if (debugStream != null) state.debugData = [];

		writeLogicHeaders.call(state, logicStream)
		.then(() => { /* writeLogicBuffers.call(state, logicStream); */ })
		.then(() => { writeDialogueHeaders.call(state, dialogueStream); })
		.then(() => { /* writeDialogBuffers.call(state, dialogueStream); */ })
		.then(() => {
			if (debugStream != null) {
				return DebugUtils.Write(state.debugData, debugStream);
			}
		})
		.then(() => { resolve();});
	});	
}