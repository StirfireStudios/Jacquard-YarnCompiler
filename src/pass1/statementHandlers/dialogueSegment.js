'use strict';

import * as Commands from '../../commands';

function setupSegment(state, identifier) {
  const newBlock = { commands: [] };
  if (identifier != null) {
    newBlock.identifier = parseInt(identifier, 16);
  }
  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogBlock: newBlock,
    characterRef: -1,
  });
  return newBlock;
}

export default function handler(statement) {
  const block = setupSegment(this, statement.identifier);
  this.currentCommandList = block.commands;

  statement.statements.forEach(statement => {
    this.processStatement(statement);
  });

  this.currentCommandList.push({ type: Commands.Names.DialogBlockEnd });

  this.currentCommandList = this.logicCommands;
}
