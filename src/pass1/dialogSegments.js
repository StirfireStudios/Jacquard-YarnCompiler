'use strict';

import * as Commands from '../commands';

export function SetDialogName(state, name) {
  return;
  state = state.dialogSegments;
  state.current.name = name;
  state.current.nameAssigned = true;
}

export function AddToCurrent(state, statement) {
  return;
  state = state.dialogSegments;

	if (state.current == null) {
		state.current = {
      name: uniqueDialogName(state),
      nameAssigned: false,
			commands: [],
		}
  }
  
  state.current.commands.push(statement);
}

export function InDialogBlock(state) {
  return false;
  return state.dialogSegments.current != null;
}

export function FinishCurrent(state) {
  return;
  const dlgState = state.dialogSegments;
  if (dlgState.current == null) return;

  dlgState.current.commands.push({
    type: Commands.Names.DialogBlockEnd,
  })

  dlgState.byName[dlgState.current.name] = {
    nameAssigned: dlgState.current.nameAssigned,
    commands: dlgState.current.commands,
  };

  state.logicCommands.push({
    type: Commands.Names.ShowDialogBlock,
    dialogRef: dlgState.current.name,
    characterRef: -1,
  });

  dlgState.current = null;
}
