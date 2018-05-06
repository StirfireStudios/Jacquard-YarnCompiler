'use strict';

import * as Commands from '../commands';

import * as Encode from './encode';

/** This pass converts all the commands into bytecode.
 * It includes the lengths of all non-jump instructions
 * Jump instructions lengths are set at the maximum possible size of the instructions
 */
export default function Pass4(state) {
	let offset = 0;
	state.logicCommands.forEach(command => {
		let encodedCommand = null;
		switch(command.type) {
			// these all take no arguments and are just the opcode.
			case Commands.Names.NoOp:
			case Commands.Names.ShowText:
			case Commands.Names.RunCommand:
			case Commands.Names.StaticNull:
			case Commands.Names.StaticTrue:
			case Commands.Names.StaticFalse:
			case Commands.Names.RunOptions:
			case Commands.Names.StartOptions:
				encodedCommand = Encode.NoArg.call(state, command);
				break;
			// these have arg0's that are indexes.
			case Commands.Names.Jump:
			case Commands.Names.JumpIfTrue:
			case Commands.Names.JumpIfFalse:
			case Commands.Names.PushOption:
			 encodedCommand = Encode.Jump.call(state, command);
				break;
			// these take a varInt
			case Commands.Names.NodeEntry:
			case Commands.Names.VariableLoad:
			case Commands.Names.VariableSet:
			case Commands.Names.StaticString:
			case Commands.Names.StaticInteger:
				encodedCommand = Encode.VarIntArg.call(state, command);
				break;
			// these all take two arguments that are Bytes (or StackOffsets)
			case Commands.Names.Add:
			case Commands.Names.Subtract:
			case Commands.Names.Multiply:
			case Commands.Names.Divide:
			case Commands.Names.Modulus:
			case Commands.Names.Equal:
			case Commands.Names.And:
			case Commands.Names.Or:
			case Commands.Names.Xor:
			case Commands.Names.GreaterThan:
			case Commands.Names.LessThan:
			case Commands.Names.ClearArguments:
				encodedCommand = Encode.ByteByte.call(state, command);
				break;
			// these all take one argument that is a Byte (or StackOffset)
			case Commands.Names.Not:
			case Commands.Names.ClearArguments:
				encodedCommand = Encode.Byte.call(state, command);
				break;
			// Functions
			case Commands.Names.FunctionReturn:
			case Commands.Names.FunctionNoReturn:
				encodedCommand = Encode.FunctionCall.call(state, command);
				break;
			// special cases
			case Commands.Names.StaticFloat:
				encodedCommand = Encode.Float.call(state, command);
				break;
			case Commands.Names.ShowDialogBlock:
				encodedCommand = Encode.ShowDialogBlock.call(state, command);
				break;
			default: 
				console.error(`Unknown or invalid command ${command.type}`);
		}
		if (encodedCommand == null) return;

		encodedCommand.info.location = command.location;
		encodedCommand.info.byteOffset = offset;
		state.logicCommandBuffers.push(encodedCommand);
		offset += encodedCommand.byteLength;
	});

	state.dialogHeaders = {}
	offset = 0;
	Object.keys(state.dialogSegments).forEach(name => {
		const dialogSegment = state.dialogSegments[name];
		state.dialogHeaders[name] = offset;
		dialogSegment.forEach(command => {
			let encodedCommand = null;
			switch(command.type) {
				// these all take no arguments and are just the opcode.
				case Commands.Names.NoOp:
				case Commands.Names.ShowText:
				case Commands.Names.RunCommand:
				case Commands.Names.DialogBlockEnd:
				case Commands.Names.StaticNull:
				case Commands.Names.StaticTrue:
				case Commands.Names.StaticFalse:
					encodedCommand = Encode.NoArg.call(state, command);
					break;
				// these take a varInt
				case Commands.Names.VariableLoad:
				case Commands.Names.StaticString:
				case Commands.Names.StaticInteger:
					encodedCommand = Encode.VarIntArg.call(state, command);
					break;
				// these all take two arguments that are Bytes (or StackOffsets)
				case Commands.Names.Add:
				case Commands.Names.Subtract:
				case Commands.Names.Multiply:
				case Commands.Names.Divide:
				case Commands.Names.Modulus:
				case Commands.Names.Equal:
				case Commands.Names.And:
				case Commands.Names.Or:
				case Commands.Names.Xor:
				case Commands.Names.GreaterThan:
				case Commands.Names.LessThan:
				case Commands.Names.ClearArguments:
					encodedCommand = Encode.ByteByte.call(state, command);
					break;
				// these all take one argument that is a Byte (or StackOffset)
				case Commands.Names.Not:
					encodedCommand = Encode.Byte.call(state, command);
					break;
					//functions
				case Commands.Names.FunctionReturn:
				case Commands.Names.FunctionNoReturn:
					encodedCommand = Encode.FunctionCall.call(state, command);
					break;
				// special case
				case Commands.Names.StaticFloat:
					encodedCommand = Encode.Float.call(state, command);
					break;
				default: 
					console.error(`Unknown or invalid command ${command.type}`);
			}
			if (encodedCommand == null) return;

			encodedCommand.info.location = command.location;
			encodedCommand.info.byteOffset = offset;
			state.dialogCommandBuffers.push(encodedCommand);

			offset += encodedCommand.byteLength;
		});
		Encode.DialogSegment(state.dialogCommandBuffers);
	});
}