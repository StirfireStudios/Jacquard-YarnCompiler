'use strict';

import * as Commands from '../commands';

export default function handleJump(command) {
	if (command.nodeName === undefined) return;
	const nodeIndex = this.nodeNames.indexOf(command.nodeName);
	command.index = this.nodeStarts[nodeIndex];
	delete(command.nodeName);
}