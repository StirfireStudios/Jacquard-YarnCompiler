'use strict';

import Write from './streamWriter';
import * as BufferUtils from '../bufferUtils';
import * as DebugUtils from './debugUtils';

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

	length = await Write(stream, BufferUtils.varString(this.language));
	DebugUtils.Add(this.debugData, offset, length, "Language");
}