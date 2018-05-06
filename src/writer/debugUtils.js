'use strict';

import StreamWrite from './streamWriter';

function hexDataFor(buffer) {
	if (buffer == null) return "n/a";
	if (typeof('buffer') === 'string') return `"${buffer}"`;
	if (buffer instanceof Buffer) return buffer.toString('hex');
	return "Unknown Type";
}

export function Add(array, start, length, message, data) {
	if (array == null) return;
	array.push({
		position: `${start} - ${start + length}`,
		message: message,
		hexData: hexDataFor(data),
	});
}

export function AddHeader(array, header) {
	array.push({
		header: header,
	});
}

export async function Write(array, stream) {
	console.log("Writing Debug File");
	const headers = [
		"Absolute Position",
		"Hex Data",
		"Notes"
	]

	const fields = ["position", "hexData", "message"];

	const maxLengths = {
		position: headers[0].length,
		hexData: headers[1].length,
		message: 0,
	}

	array.forEach(debugLine => {
		if (debugLine.header != null) {
			const entryLength = debugLine.header.length;
			if (maxLengths[fields[0]] < entryLength) maxLengths[fields[0]] = entryLength;
			return;
		}
		fields.forEach((field) => {
			const entryLength = debugLine[field].length
			if (maxLengths[field] < entryLength) maxLengths[field] = entryLength;
		});
	});	

	let index = 0;

	for(index = 0; index < fields.length - 1; index++) {
		const padding = maxLengths[fields[index]];
		await StreamWrite(stream, headers[index].padEnd(padding));
		await StreamWrite(stream, " | ");
	}
	await StreamWrite(stream, headers[index]);
	await StreamWrite(stream, "\n");

	for(let arrayIdx = 0; arrayIdx < array.length; arrayIdx++) {
		const debugLine = array[arrayIdx];
		if (debugLine.header != null) {
			for(let index = 0; index < fields.length - 1; index++) {
				let padding = maxLengths[fields[index]];
				await StreamWrite(stream, "".padEnd(padding, "="));
				await StreamWrite(stream, "=|=");
			}
			await StreamWrite(stream, debugLine.header);
			await StreamWrite(stream, "\n");
			continue;
		}
		let index = 0;
		for(index = 0; index < fields.length - 1; index++) {
			const padding = maxLengths[fields[index]];
			await StreamWrite(stream, debugLine[fields[index]].padEnd(padding));
			await StreamWrite(stream, " | ");
		}			
		await StreamWrite(stream, debugLine[fields[index]]);
		await StreamWrite(stream, "\n");		
	}	
}