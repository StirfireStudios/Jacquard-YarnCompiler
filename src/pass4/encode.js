'use strict';

import * as BufferUtils from '../bufferUtils';
import * as Commands from '../commands';

export function Byte(command) {
	const byteArray = [Commands.ByName[command.type], command.arg0];
	const buffer = Buffer.from(byteArray);
	buffer.info = {};
	return buffer;
}

export function ByteByte(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const args = Buffer.from([command.arg0, command.arg1]);
	const buffer = Buffer.concat([opCode, args]);
	buffer.info = {};
	return buffer;
}

export function DialogSegment() {
	return NoArg({type: Commands.Names.DialogBlockEnd});
}

export function FunctionCall(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const bytes = [command.arg0];
	for(let i = 1; i <= command.arg0; i++) {
		bytes.push(command[`arg${i}`]);
	}
	const buffer = Buffer.concat([opCode, Buffer.from(bytes)]);
	buffer.info = {};
	return buffer;
}

export function Jump(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const address = BufferUtils.fixedInt(0, BufferUtils.varIntMaxSize);
	const buffer = Buffer.concat([opCode, address]);
	buffer.info = {};
	return buffer;
}

export function NoArg(command) {
	const buffer = Buffer.from([Commands.ByName[command.type]]);
	buffer.info = {};
	return buffer;
}

export function ShowDialogBlock(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const byteArray = BufferUtils.varBytesFromHexString(command.arg0);
	const buffer = Buffer.concat([opCode, byteArray]);
	buffer.info = {};
	return buffer;
}

export function StaticFloat(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const args = BufferUtils.float32(command.arg0);
	const buffer = Buffer.concat([opCode, args]);	
	buffer.info = {};
	return buffer;
}

export function VarIntArg(command) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	const arg0 = BufferUtils.varInt(command.arg0);
	const buffer = Buffer.concat([opCode, arg0]);
	buffer.info = {};
	return buffer;
}
