'use strict';

import * as Commands from '../commands';

import * as BufferUtils from '../bufferUtils';

function commandIsJump(command) {
	const type = command.type;
	return type == Commands.Names.Jump ||
	  type == Commands.Names.JumpIfTrue ||
	  type == Commands.Names.JumpIfFalse ||
	  type == Commands.Names.PushOption;	
}
 
export function encodeJump(command, destination, intSize) {
	const opCode = Buffer.from([Commands.ByName[command.type]]);
	command.address = destination;
	let address = null;
	if (intSize == null) {
		address = BufferUtils.varInt(destination);
		command.addressSize = BufferUtils.varIntLength(destination) - 1;
	} else {
		address = BufferUtils.fixedInt(destination, intSize);
	}
	
	const buffer = Buffer.concat([opCode, address]);
	buffer.info = {location: command.location};
	return buffer;
}

/** Calculate size of jump addresses now we know the rough locations of everything
 */
export default function Pass5(state) {
	const nodeStartIndexes = state.nodeStarts;
	state.nodeStarts = [];

	let offset = 0;
	// this calculates the actual size of the jump addresses;
	for(let index = 0; index < state.logicCommands.length; index++) {
		const command = state.logicCommands[index];

		if (commandIsJump(command)) {
			const destinationBuffer = state.logicCommandBuffers[command.index];
			const jumpOffset = destinationBuffer.info.byteOffset;
			state.logicCommandBuffers[index] = encodeJump(command, jumpOffset);
		}

		const encodedCommand = state.logicCommandBuffers[index];
		encodedCommand.info.byteOffset = offset;
		offset += encodedCommand.byteLength;
	}

	offset = 0;
	// this writes the final jump addresses;
	for(let index = 0; index < state.logicCommands.length; index++) {
		const command = state.logicCommands[index];

		if (commandIsJump(command)) {
			const destinationBuffer = state.logicCommandBuffers[command.index];
			const jumpOffset = destinationBuffer.info.byteOffset;
			const buffer = encodeJump(command, jumpOffset, command.addressSize);
			buffer.info.byteOffset = state.logicCommandBuffers[index].info.byteOffset;
			state.logicCommandBuffers[index] = buffer;
		}

		const encodedCommand = state.logicCommandBuffers[index];
		if (encodedCommand.info.byteOffset != offset) {
			throw new Error(`Pass 5a Offset ${encodedCommand.info.byteOffset} didn't match currentOffset ${offset} at index ${index}`);
		}

		if (index == nodeStartIndexes[0]) {
			state.nodeStarts.push(offset);
			nodeStartIndexes.shift();
		}

		offset += encodedCommand.byteLength;
	}
}