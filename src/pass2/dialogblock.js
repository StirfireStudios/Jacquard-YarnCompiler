'use strict';

import * as Commands from '../commands';

export default function handleCommand(command, nodeSegments) {
	let name = command.dialogRef;
	const orgDialogSegment = nodeSegments.byName[name];
	if (orgDialogSegment == null) {
		console.error("Node referencing a non-existant dialog segment!");
		return;
	}

	if (orgDialogSegment.nameAssigned) {
		if (this.dialogSegments[name] != null) {
			console.error(`Dialog segment "${name}" exists more than once!`);
			return;
		}
	} else {
		// find next name and rewrite references
		let exists = true;
		while(exists) {
			this.dialogNameIndex += 1;
			name = this.dialogNameIndex.toString(16);
			exists = this.dialogSegments[name] != null;
		}
	}

	if (name.length > this.dialogNameMaxLength) {
		this.dialogNameMaxLength = name.length; 
	}

	this.dialogSegments[name] = orgDialogSegment.commands.map(command => {
		return Object.assign({}, command);
	});

	command.arg0 = name;
	delete(command.dialogRef);
}