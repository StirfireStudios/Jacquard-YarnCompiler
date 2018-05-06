'use strict';

import Write from './streamWriter';
import * as BufferUtils from '../bufferUtils';
import * as DebugUtils from './debugUtils';

export default async function write(stream) {
	console.log("Writing Logic Headers");
	let offset = 0;
	let length = 0;

	DebugUtils.AddHeader(this.debugData, "Logic File Debug Info");

	//Type - Jaquard Logic
	length = await Write(stream, "JQRDL");
	DebugUtils.Add(this.debugData, offset, length, "File Type", "JQRDL")
	offset += length;

 	//Version 
	length = await Write(stream, BufferUtils.varString(this.version));
	DebugUtils.Add(this.debugData, offset, length, "Version", this.version)
	offset += length;
}
