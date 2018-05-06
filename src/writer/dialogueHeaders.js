'use strict';

import * as BufferUtils from '../bufferUtils';
import * as CreateTableBuffers from './tableBuffers';
import * as DebugUtils from './debugUtils';
import Write from './streamWriter';

const StringTableOrder = 	["dialogCharacters", "dialogStrings"]; 

export default async function write(stream) {
	console.log("Writing Dialogue Headers");
	let offset = 0;
	let length = 0;
 
	DebugUtils.AddHeader(this.debugData, "Dialogue File Debug Info");

	// Type - Jacquard Dialog
	length = await Write(stream, "JQRDD");
	DebugUtils.Add(this.debugData, offset, length, "File Type", "JQRDD".toString(16))
	offset += length;

	// Version
	length = await Write(stream, BufferUtils.varString(this.version));
	DebugUtils.Add(this.debugData, offset, length, "Version", this.version);
	offset += length;

	// language
	length = await Write(stream, BufferUtils.varString(this.language));
	DebugUtils.Add(this.debugData, offset, length, "Language");
	offset += length;

	//StringTables
	let indexBuffers = [];
	const tableBuffers = [];

	for(let tableName of StringTableOrder) {
		const table = this.state[tableName];
		if (table.length == 0) {
			indexBuffers.push(BufferUtils.varInt(0));
			tableBuffers.push({byteLength: 0, name: tableName});
			continue;
		}
		const buffers = CreateTableBuffers.String(table, this.debugData);
		buffers.name = tableName;
		indexBuffers.push(BufferUtils.fixedInt(0, BufferUtils.varIntMaxSize));
		tableBuffers.push(buffers);
	}

	//Dialog entry table
	const dialogEntryBuffers = CreateTableBuffers.ByteEntryPoint(
		this.state.dialogHeaders, this.debugData,
	);

	dialogEntryBuffers.name = "Dialog Entry Table";
	indexBuffers.push(BufferUtils.fixedInt(0, BufferUtils.varIntMaxSize));
	tableBuffers.push(dialogEntryBuffers);	

	//estimate table offset sizes;
	let maxOffset = offset;
	for(let indexBuffer of indexBuffers) maxOffset += indexBuffer.byteLength;

	let tableStartOffset = offset;
	for(let tableBuffer of tableBuffers) {
		if (tableBuffer.byteLength == 0) {
			const buffer = BufferUtils.varInt(0);
			tableStartOffset += buffer.byteLength;
		} else {
			const buffer = BufferUtils.varInt(maxOffset);
			tableBuffer.offsetLength = BufferUtils.varIntLength(maxOffset) - 1;
			tableStartOffset += buffer.byteLength;
		}
		maxOffset += tableBuffer.byteLength;
	}

	let buffer = BufferUtils.varInt(maxOffset);
	const instructionStartOffsetLength = BufferUtils.varIntLength(maxOffset) - 1;
	tableStartOffset += buffer.byteLength;

	//calculate and write actual table offsets;
	for(let tableBuffer of tableBuffers) {
		let buffer = null;
		let message = null;
		if (tableBuffer.byteLength == 0) {
			buffer = BufferUtils.varInt(0);
			message = `${tableBuffer.name} isn't present - offset is 0`;
		} else {
			buffer = BufferUtils.fixedInt(tableStartOffset, tableBuffer.offsetLength);
			message = `${tableBuffer.name} starts at ${tableStartOffset}`;
		}
		length = await Write(stream, buffer);
		DebugUtils.Add(this.debugData, offset, length, message ,buffer);
		offset += length;
		tableStartOffset += tableBuffer.byteLength;
	}

	buffer = BufferUtils.fixedInt(tableStartOffset, instructionStartOffsetLength);
	length = await Write(stream, buffer);
	DebugUtils.Add(
		this.debugData, offset, length, 
		`Dialog Instructions start at ${tableStartOffset}`, buffer);
	offset += length;

	for(let tableBuffer of tableBuffers) {
		if (tableBuffer.byteLength === 0) continue; 
		DebugUtils.AddHeader(this.debugData, `${tableBuffer.name} Table`);
		DebugUtils.AddTempToMain(this.debugData, tableBuffer.debugData, offset);
		for(let buffer of tableBuffer) {
			length = await Write(stream, buffer);
			offset += length;
		}
	}	
}