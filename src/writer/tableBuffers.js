'use strict';

import * as BufferUtils from '../bufferUtils';
import * as DebugUtils from './debugUtils';

export function String(table, debugData) {
	const tableBuffers = []
	if (debugData != null) { tableBuffers.debugData = []; }
	let offset = 0;
	let buffer = BufferUtils.varInt(table.length);
	tableBuffers.push(buffer);
	const debugEntry = DebugUtils.AddTemp(
		tableBuffers.debugData, 0, buffer.byteLength, 
		`Table has ${table.length} entries`, buffer
	);
	offset += buffer.byteLength;

	for(let stringVal of table) {
		buffer = BufferUtils.varString(stringVal);
		tableBuffers.push(buffer);
		DebugUtils.AddTemp(tableBuffers.debugData, offset, buffer.byteLength, stringVal);
		offset += buffer.byteLength;
	}
	
	DebugUtils.SetLength(debugEntry, offset);
	tableBuffers.byteLength = offset;
	return tableBuffers;
}

export function StringEntryPoint(stringTable, entryPointTable, debugData) {
	const tableBuffers = []
	if (debugData != null) { tableBuffers.debugData = []; }
	let offset = 0;
	let buffer = BufferUtils.varInt(stringTable.length);
	tableBuffers.push(buffer);
	const debugEntry = DebugUtils.AddTemp(
		tableBuffers.debugData, 0, buffer.byteLength, 
		`Table has ${stringTable.length} entries`, buffer
	);
	offset += buffer.byteLength;

	for(let index = 0; index < stringTable.length; index++) {
		const stringVal = stringTable[index];
		const entryPoint = entryPointTable[index];
		const buffer = Buffer.concat([BufferUtils.varString(stringVal), BufferUtils.varInt(entryPoint)]);
		DebugUtils.AddTemp(
			tableBuffers.debugData, offset, 
			buffer.byteLength, 
			`"${stringVal}" starts at offset ${entryPoint}`,
		);
		tableBuffers.push(buffer);
		offset += buffer.byteLength;
	}	
	
	DebugUtils.SetLength(debugEntry, offset);
	tableBuffers.byteLength = offset;
	return tableBuffers;
}

export function ByteEntryPoint(byteTable, debugData) {
	const tableBuffers = []
	if (debugData != null) { tableBuffers.debugData = []; }
	const byteNames = Object.keys(byteTable);
	let offset = 0;
	let buffer = BufferUtils.varInt(byteNames.length);
	tableBuffers.push(buffer);
	const debugEntry = DebugUtils.AddTemp(
		tableBuffers.debugData, 0, buffer.byteLength, 
		`Table has ${byteNames.length} entries`, buffer
	);

	offset += buffer.byteLength;

	for(let index = 0; index < byteNames.length; index++) {
		const byteHexString = byteNames[index];
		const entryPoint = byteTable[byteHexString];
		const buffer = Buffer.concat([BufferUtils.varBytesFromHexString(byteHexString), BufferUtils.varInt(entryPoint)]);
		DebugUtils.AddTemp(
			tableBuffers.debugData, offset, 
			buffer.byteLength, 
			`"${byteHexString}" starts at offset ${entryPoint}`,
		);
		tableBuffers.push(buffer);
		offset += buffer.byteLength;
	}	

	DebugUtils.SetLength(debugEntry, offset);	
	tableBuffers.byteLength = offset;
	return tableBuffers;
}