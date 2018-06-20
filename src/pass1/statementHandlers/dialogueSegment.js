'use strict';

import * as Commands from '../../commands';

function setupSegment(state, identifier) {
  const newSegment = { commands: [] };
  if (identifier != null) {
    state.dialogSegments[identifier] = newSegment;
    newSegment.identifier = identifier;
  } else {
    state.unidentifiedDialogSegments.push(newSegment);
  }
  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogueSegment: newSegment,
    characterRef: -1,
  });
  return newSegment;
}

export default function handler(statement) {
  const segment = setupSegment(this, statement.identifier);
  this.currentCommandList = segment.commands;

  statement.statements.forEach(statement => {
    this.processStatement(statement);
  });

  this.currentCommandList.push({ type: Commands.Names.DialogBlockEnd });

  this.currentCommandList = this.logicCommands;
}
