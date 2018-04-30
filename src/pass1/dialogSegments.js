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
  state.current.name = name;
}

export function AddToCurrent(state, statement) {
  state = state.dialogSegments;

	if (state.current == null) {
		state.current = {
			name: uniqueDialogName(state),
			commands: [],
		}
  }
  
  state.current.commands.push(statement);
}

export function InDialogBlock(state) {
  return state.dialogSegments.current != null;
}

export function FinishCurrent(state) {
  const dlgState = state.dialogSegments;
  if (dlgState.current == null) return;
  dlgState.byName[dlgState.current.name] = dlgState.current.commands;

  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogRef: dlgState.current.name,
    characterRef: -1,
  });

  dlgState.current = null;
}

export function Setup(state) {
  state.dialogSegments = {
    current: null,
    byName: {},
    nameIndex: -1,
  }
}