'use strict';

export default function handler(statement) {
  this.currentCommandList = [];
  if (statement.identifier != null) {
    this.dialogSegments[statement.identifier] = {
      identifier: statement.identifier,
      commands: this.currentCommandList,
    }
  } else {
    this.unidentifiedDialogSegments.push({
      commands: this.currentCommandList,
    })
  }

  statement.statements.forEach(statement => {
    this.processStatement(statement);
  });

  this.currentCommandList = this.logicCommands;
}
