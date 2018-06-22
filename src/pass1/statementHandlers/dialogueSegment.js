'use strict';

import * as Commands from '../../commands';

function setupSegment(state, identifier, characterName) {
  const newBlock = { commands: [] };
  if (identifier != null) newBlock.identifier = parseInt(identifier, 16);
  const command = {
    type: Commands.Names.ShowDialogBlock,
    dialogBlock: newBlock,
    characterRef: null,
  }
  if (characterName != null) command.characterRef = characterName;
  state.logicCommands.push(command);
  return newBlock;
}

export default function handler(statement) {
  const block = setupSegment(this, statement.identifier, statement.characterName);
  this.currentCommandList = block.commands;

  statement.statements.forEach(statement => {
    this.processStatement(statement);
  });

  this.currentCommandList.push({ type: Commands.Names.DialogBlockEnd });

  this.currentCommandList = this.logicCommands;
}
