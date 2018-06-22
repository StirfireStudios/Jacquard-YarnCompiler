'use strict';

import * as Commands from '../../commands';

function setupSegment(state, identifier, characterName) {
  const newBlock = { commands: [] };
  if (identifier != null) newBlock.identifier = parseInt(identifier, 16);
  if (characterName != null) newBlock.characterName = characterName;
  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogBlock: newBlock,
    characterRef: -1,
  });
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
