'use strict';

import * as Commands from '../../commands';

export default function handler(statement) {
  this.logicCommands.push({
    type: Commands.Names.Jump,
    nodeName: statement.destination,
  });
}