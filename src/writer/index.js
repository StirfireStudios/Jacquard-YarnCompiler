'use strict';

const VERSION = '0.1.0';
const Language = "EN-au"; 

import writeCommands from './commands';
import writeDialogueHeaders from './dialogueHeaders';
import writeLogicHeaders from './logicHeaders';
import * as DebugUtils from './debugUtils';

function createState(state) {
	return {
		sourceMapData: null,
		debugData: null,
		version: VERSION, 
		language: Language,
		state: state,			
		offset: 0,
	}
}

export function Stream(logicStream, dialogueStream, sourceMapStream, debugStream) {	
	return new Promise((resolve, reject) => {
		const state = createState(this);
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

export function Buffers(includeSourceMap, includeDebug) {
	return new Promise((resolve, reject) => {
		const state = createState(this);
		if (includeSourceMap) state.sourceMapData = {logic: [], dialog:[] };
		if (includeDebug) state.debugData = [];

		const logicBuffers = [];
		const dialogueBuffers = [];
		const debugBuffers = [];

		DebugUtils.AddHeader(state.debugData, "Logic File Begin");
		writeLogicHeaders.call(state, logicBuffers)
		.then(() => {
			DebugUtils.AddHeader(state.debugData, "Logic Instruction Block");
			return writeCommands.call(state, 
				logicBuffers, this.logicCommands, this.logicCommandBuffers, this.strings, "logic",
			);
		})
		.then(() => { 
			DebugUtils.AddHeader(state.debugData, "Default Dialogue File Begin");
			return writeDialogueHeaders.call(state, dialogueBuffers);
		})
		.then(() => { 
			DebugUtils.AddHeader(state.debugData, "Dialogue Instruction Block");
			return writeCommands.call(state,
				dialogueBuffers, this.dialogCommands, this.dialogCommandBuffers, this.dialogStrings, "dialog",
			);
		})
		.then(() => {
			if (includeDebug) {
				return DebugUtils.Write(state.debugData, debugBuffers);
			}
		})		
		.then(() => { resolve({
			logic: Buffer.concat(logicBuffers),
			dialogue: Buffer.concat(dialogueBuffers),
			sourceMapStream: JSON.stringify(state.sourceMapData),
			debugStream: includeDebug ? Buffer.concat(debugBuffers).toString() : null,
		});});
	});
}
