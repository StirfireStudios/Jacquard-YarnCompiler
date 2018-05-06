'use strict';

import StreamWrite from './streamWriter';

function hexDataFor(buffer) {
	if (buffer == null) return "---";
	if (buffer instanceof Buffer) return buffer.toString('hex');
	if (typeof('buffer') === 'string') return `"${buffer}"`;
	return "Unknown Type";
}

export function Add(array, start, length, message, data) {
	if (array == null) return null;
	const entry = {
		start: start,
		position: `${start} - ${start + length - 1}`,
		message: message,
		hexData: hexDataFor(data),
	};
	array.push(entry);
	return entry;
}

export function AddTemp(tempArray, start, length, message, data) {
	if (tempArray == null) return null;
	const entry = {
		start: start,
		length: length,
		message: message,
		hexData: hexDataFor(data),
	};
	tempArray.push(entry);
	return entry;
}

export function SetLength(debugEntry, newLength) {
	if (debugEntry == null) return;
	if (debugEntry.length != null) {
		debugEntry.length = newLength;
		return;
	}
	if (debugEntry.position != null) {
		debugEntry.position = `${start} - ${start + newLength - 1}`
	}
	return;
}

export function AddTempToMain(array, tempArray, startOffset) {
	for(let entry of tempArray) {
		if (entry.header != null) {
			array.push(tempArray);
			return;
		}
		const start = startOffset + entry.start;
		const end = startOffset + entry.start + entry.length - 1;
		array.push({
			position: `${start} - ${end}`,
			hexData: entry.hexData,
			message: entry.message,
		});
	}
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