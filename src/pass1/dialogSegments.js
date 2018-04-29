'use strict';

import * as Commands from '../commands';

function uniqueDialogName(state) {
  let exists = true;
  let name = null; 
  while(exists) {
    state.nameIndex += 1;
    name = state.nameIndex.toString(16);
    exists = state.byName[name] != null;
  }

  return name;
}

export function SetDialogName(state, name) {
  state = state.dialogSegments;
  state.currentDialog.name = name;
}

export function AddToCurrent(state, statement) {
  state = state.dialogSegments;

	if (state.currentDialog == null) {
		state.currentDialog = {
			name: uniqueDialogName(state),
			commands: [],
		}
  }
  
  state.currentDialog.commands.push(statement);
}

export function InDialogBlock(state) {
  return state.dialogSegments.currentDialog != null;
}

export function FinishCurrent(state) {
  const dlgState = state.dialogSegments;
  if (dlgState.currentDialog == null) return;
  dlgState.byName[dlgState.currentDialog.name] = dlgState.currentDialog.commands;

  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogRef: dlgState.currentDialog.name,
    characterRef: -1,
  });

  dlgState.currentDialog = null;
}

export function Setup(state) {
  state.dialogSegments = {
    current: null,
    byName: {},
    nameIndex: -1,
  }
}