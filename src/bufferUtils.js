'use strict';

export function length(buffer) {
	if (buffer == null) {
		return 0;
	} else if (buffer instanceof Buffer) {
		return buffer.length;
	} else if (typeof(buffer) == 'object') {
		let length = 0;
		buffer.forEach(function(item) {
			length += Length(item);
		});
		return length;
	} else {
		return 0;
	}
}

export function createDebugInfo(buffer, notes, options) {
	if (options == null) options = {}
	if (options.hexdata == null) options.hexdata = buffer.toString('hex');
	const debugInfo = {
		data: options.hexdata,
		length: Length(buffer),
		notes: notes
	};
	if (options.start != null) {
		debugInfo.index = `${options.start} - ${options.start + debugInfo.length}`;
	}

	return debugInfo;
}

export function varInt(number) {
	const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
	const negative = number < 0;

	if (number == 0) {
		const buffer = Buffer.alloc(1);
		buffer[0] = 0;
		return buffer;
	}

	if (negative) {
		number = -1 * number;
	}

  for (let i = 0; i < byteArray.length; i ++ ) {
        var byte = number & 0xff;
        byteArray [ i ] = byte;
        number = (number - byte) / 256 ;
	}
	let length = byteArray.length;

	for (var i = byteArray.length - 1; i >= 0; i--) {
		if (byteArray[i] != 0) break;
		length--;
	}
	
	if (length < 1) length = 1;
	if (length > 2 && length < 4) length = 4;
	if (length > 4) length = 8; 

	const buffer = Buffer.alloc(length + 1);
	if (negative) {
		buffer[0] = 128 | length;
	} else {
		buffer[0] = length;
	}
	for(let i = 0; i < length; i++) {
		buffer[i+1] = byteArray[i];
	}
	return buffer;
}

export function varIntLength(number) {
	if (number == 0) {
		return 1;
	}

	if (number < 0) {
		number = -1 * number;
	}

	const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < byteArray.length; i ++ ) {
        var byte = number & 0xff;
        byteArray [ i ] = byte;
        number = (number - byte) / 256 ;
	}
	let length = byteArray.length;

	for (var i = byteArray.length - 1; i >= 0; i--) {
		if (byteArray[i] != 0) break;
		length--;
	}

	if (length < 1) length = 1;
	if (length > 2 && length < 4) length = 4;
	if (length > 4) length = 8; 
	
	return length + 1;
}

// Warning: number must fit in length bytes!
export function fixedInt(number, length) {
	const negative = number < 0;
	const buffer = Buffer.alloc(length + 1);
	if (negative) {
		number = number * -1;
		buffer[0] = 128 | length;
	} else {
		buffer[0] = length;
	}

	for (let i = 0; i < length; i ++ ) {
        var byte = number & 0xff;
        buffer [ i+1 ] = byte;
        number = (number - byte) / 256 ;
	}

	return buffer;
}

export function varString(string, writeDebugInfo) {
	const uintarray = Buffer.from(string);
	const lengthBuffer = varInt(uintarray.length);
	const stringBuffer = Buffer.from(uintarray);
	const buffer = Buffer.concat([lengthBuffer, stringBuffer]);
	if (writeDebugInfo) {
		buffer.debugInfo = [
			{ 
				start: 0, 
				end: lengthBuffer.length - 1,
				hexdata: lengthBuffer.toString('hex'),
				notes: `${uintarray.length} byte long utf-8 string`
			},
			{
				start: lengthBuffer.length,
				end: buffer.length,
				hexdata: "<STRING>",
				notes: `"${string}"`
			}
		];
	}
	return buffer;
}

export function varBytesFromHexString(hexString, writeDebugInfo) {
	const bytes = [];
	let endIndex = hexString.length;
	while(endIndex > 0) {
		let startIndex = endIndex - 2;
		if (startIndex < 0) startIndex = 0;
		const stringPart = hexString.slice(startIndex, endIndex);
		const intValue = parseInt(stringPart, 16); 
		bytes.push(intValue);
		endIndex -= 2;
	}
	const lengthBuffer = varInt(bytes.length);
	const buffer = Buffer.concat([lengthBuffer, Buffer.from(bytes)]);
	return buffer; 
}

export function varBytes(bytes, writeDebugInfo) {
	const byteArray = Buffer.from(bytes);
	const lengthBuffer = varInt(byteArray.length);
	const buffer = Buffer.concat([lengthBuffer, byteArray]);
	if (writeDebugInfo) {
		buffer.debugInfo = [
			{ 
				start: 0, 
				end: lengthBuffer.length - 1,
				hexdata: lengthBuffer.toString('hex'),
				notes: `${uintarray.length} byte long byte array`,
			},
			{
				start: lengthBuffer.length,
				end: buffer.length,
				hexdata: byteArray.toString('hex'),
			}			
		]
	}
}

export function stringTable(stringArray, writeDebugInfo) {
	const buffers = [varInt(stringArray.length)];
	const debugInfo = [];
	if (writeDebugInfo) {
		debugInfo.push({
			start: 0,
			end: Length(buffers),
			hexdata: buffers[0].toString('hex'),
			notes: `Table is ${stringArray.length} entries long`
		});
	}
	stringArray.forEach(function(string) {
		const buffer = varString(string, writeDebugInfo);
		if (writeDebugInfo && buffer.debugInfo != null) {
			buffer.debugInfo.forEach(function(info) { 
				info.start = info.start + Length(buffers);
				info.end = info.end + Length(buffers);
				debugInfo.push(info);
			});
		}
		buffers.push(buffer);
	})
	const outputBuffer = Buffer.concat(buffers);
	if (writeDebugInfo) { outputBuffer.debugInfo = debugInfo }
	return outputBuffer;	
}

export function float32(float) {
	var tmp = new ArrayBuffer(4);
	var view = new Float32Array(tmp);
	view[0] = float;
	return Buffer.from(tmp);	
}

export function float64(float) {
	var tmp = new ArrayBuffer(8);
	var view = new Float64Array(tmp);
	view[0] = float;
	return Buffer.from(tmp);	
}

export const varIntMaxSize = 9;
