'use strict';

const VERSION = '0.1.0';
const Language = "EN-au"; 

import writeCommands from './commands';
import writeDialogueHeaders from './dialogueHeaders';
import writeLogicHeaders from './logicHeaders';
import * as DebugUtils from './debugUtils';

function writeLogicBuffers(stream) {
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
			offset: 0,
		}
		if (sourceMapStream != null) state.sourceMapData = {logic: [], dialog:[] };
		if (debugStream != null) state.debugData = [];

		DebugUtils.AddHeader(state.debugData, "Logic File Begin");
		writeLogicHeaders.call(state, logicStream)
		.then(() => { 
			DebugUtils.AddHeader(state.debugData, "Logic Instruction Block");
			return writeCommands.call(state, 
				logicStream, this.logicCommands, this.logicCommandBuffers, this.strings, "logic",
			);
		})
		.then(() => { 
			DebugUtils.AddHeader(state.debugData, "Default Dialogue File Begin");
			return writeDialogueHeaders.call(state, dialogueStream);
		})
		.then(() => { 
			DebugUtils.AddHeader(state.debugData, "Dialogue Instruction Block");
			return writeCommands.call(state,
				dialogueStream, this.dialogCommands, this.dialogCommandBuffers, this.dialogStrings, "dialog",
			);
		})
		.then(() => {
			if (sourceMapStream != null) {
				sourceMapStream.write(JSON.stringify(state.sourceMapData));
			}
		})
		.then(() => {
			if (debugStream != null) {
				return DebugUtils.Write(state.debugData, debugStream);
			}
		})
		.then(() => { resolve();});
	});	
}