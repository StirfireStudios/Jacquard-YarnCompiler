'use strict';

import * as Commands from '../commands';

export default function handleJump(command) {
	if (command.index === undefined) return;
	command.index += this.currentNode.logicOffset;
}