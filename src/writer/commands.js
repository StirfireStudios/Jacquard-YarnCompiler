'use strict'

import * as Commands from '../commands';
import * as DebugUtils from './debugUtils';
import Write from './streamWriter';

function addSourceMapData(data, type, offset, command) {
  if (command.location == null) return;
  data[type][offset] = command.location;
}

function jumpSuffix(type) {
  switch(type) {
    case Commands.Names.Jump:
      return "";
    case Commands.Names.JumpIfTrue:
    return " If top argument on stack is true (also remove that argument)";
    case Commands.Names.JumpIfFalse:
      return " If top argument on stack is false (also remove that argument)";
    default:
      return "Unknown jump type!";
  }
}

function clearSuffix(command) {
  let msg = `starting at ${command.arg0}`;
  if (command.arg1 === 255) {
    msg += " until the end";
  } else {
    msg += ` and clearing ${command.arg1} values`;
  }
  return msg;
}

function addDebugInfo(command, buffer, strings, localOffset, length) {
  let message = "";
  switch(command.type) {
    case Commands.Names.Noop: 
      message = "NoOp";
      break;
    case Commands.Names.ShowText:
      message = `Show the Text on the argument stack`;
      break;
    case Commands.Names.RunCommand:
      message = `Run the command on the argument stack`;
      break;
    case Commands.Names.ShowDialogBlock:
      message = `Show Dialog Block ${command.arg0} with character ${command.arg1}`;
      break;    
    case Commands.Names.DialogBlockEnd:
      message = `End Dialog Block`;
      break;
    case Commands.Names.NodeEntry:
      message = `Enter Node index ${command.arg0} ("${this.state.nodeNames[command.arg0]}")`;
      break;
    case Commands.Names.Jump:
    case Commands.Names.JumpIfTrue:
    case Commands.Names.JumpIfFalse:
      message = `Jump to offset ${command.address} (index: "${command.index}")${jumpSuffix(command.type)}`;
      break;
    case Commands.Names.VariableLoad:
      message = `Load Variable ${command.arg0} ("${this.state.variables[command.arg0]}") onto argument stack`;
      break;
    case Commands.Names.VariableSet:
      message = `Save Variable ${command.arg0} ("${this.state.variables[command.arg0]}") onto argument stack`;
      break;
    case Commands.Names.StaticNull:
      message = `Load a null onto argument stack`;
      break;
    case Commands.Names.StaticTrue:
      message = `Load a true onto argument stack`;
      break;
    case Commands.Names.StaticFalse:
      message = `Load a false onto argument stack`;
      break;
    case Commands.Names.StaticString:
      message = `Load the string at index ${command.arg0} ("${strings[command.arg0]}") argument stack`;
      break;
    case Commands.Names.StaticFloat:
      message = `Load the float ${command.arg0} argument stack`;
      break;
    case Commands.Names.StaticInteger:
      message = `Load the integer ${command.arg0} argument stack`;
      break;
    case Commands.Names.Add:
    case Commands.Names.Subtract:
    case Commands.Names.Multiply:
    case Commands.Names.Divide:
    case Commands.Names.Modulus:
      message = `Mathematically ${command.type.toLowerCase()} the stack arguments at ${command.arg0} and ${command.arg1}`;
      break;
    case Commands.Names.Equal:
    case Commands.Names.And:
    case Commands.Names.Or:
    case Commands.Names.Xor:
      message = `Logically ${command.type.toLowerCase()} the stack arguments at ${command.arg0} and ${command.arg1}`;
      break;
    case Commands.Names.Not:
      message = `Logically not the stack argument at ${command.arg0} `;
      break;
    case Commands.Names.GreaterThan:
    case Commands.Names.LessThan:
      message = `If ${command.arg0} ${command.type.toLowerCase()} ${command.arg1} - push true on stack, false otherwise`;
      break;
    case Commands.Names.FunctionReturn:
      message = " and push the return value onto the stack";
    case Commands.Names.FunctionNoReturn:
      let argMsg = "";
      for(let index = 0; index < command.arg1; index++) {
        argMsg += command[`arg${index + 2 }`];
        argMsg += ", ";
      }
      argMsg = argMsg.slice(0, argMsg.length - 2);
      message = `Run the function at ${command.arg0} ("${this.state.functions[command.arg0]}") with the ${command.arg1} stack arguments: ${argMsg}${message}`;
      break;
    case Commands.Names.PushOption:
      message = `Push another option onto the stack, skip to offset ${command.address} (index: "${command.index}")`;
      break;
    case Commands.Names.RunOptions:
      message = `Run options on the stack. Clear option stack when complete`;
      break;
    case Commands.Names.ClearArguments:
      message = `Clear arguments off the stack ${clearSuffix(command)}`;
      break;
    case Commands.Names.ClearOptionStack:
      message = `Clear options off the stack ${clearSuffix(command)}`;
      break;
    case Commands.Names.StopExecution:
      message = "Halt exection of the runtime, don't allow it to proceed unless the IP is moved.";
      break;
    default:
      message = "Unknown command!";
  }
  DebugUtils.AddWithLocalOffset(this.debugData, this.offset, localOffset, length, message, buffer);
}

export default async function writeCommands(stream, commands, buffers, strings, sourceMapType) {
  let localOffset = 0;
  for(let index = 0; index < commands.length; index++) {
    const command = commands[index];
    const buffer = buffers[index];
    const length = await Write(stream, buffer);
    if (this.debugData != null) addDebugInfo.call(this, command, buffer, strings, localOffset, length);
    if (this.sourceMapData != null) addSourceMapData(this.sourceMapData, sourceMapType, localOffset, command);
    this.offset += length;
    localOffset += length;
  }
}
