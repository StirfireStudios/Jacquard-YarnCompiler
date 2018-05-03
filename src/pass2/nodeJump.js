'use strict';

import * as Commands from '../commands';

export default function handleJump(command) {
	if (command.nodeName === undefined) return;
	const nodeIndex = this.nodeNames.indexOf(command.nodeName);
	if (nodeIndex == -1) {
		console.log("Location: " + command.location);
		throw Error(`Node ${command.nodeName} doesn't exist`);
	}
	command.index = this.nodeStarts[nodeIndex];
	delete(command.nodeName);
}