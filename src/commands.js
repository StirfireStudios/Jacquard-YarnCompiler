'use strict';

/** Command types by name (constant is the opcode in octal)
 * @name ByName
 * @readonly
 * @enum {string}
 */
export const byName = {
	/** Do nothing.
	 * This is a valid Logic File instruction.
	 * This is a valid Dialog File instruction.
	 * No parameters
	 * @memberof ByName
	 */
	Noop: "000",
	/** Display the current stack.
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	ShowText: "001",
	/** Pass the current stack to the engine as a message
   * This is a valid Logic File instruction. 
 	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	RunCommand: "101",
	/** Display the given dialog block
   * This is a valid Logic File instruction. 
 	 * 0 - (varBytes) - the dialog block reference in the Dialog File
	 * 1 - (varInt) - the character reference in the Dialog File (or -1 if no character)
	 * @memberof ByName
	 */
	ShowDialogBlock: "201",
	/** End the Dialog Block
	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	DialogBlockEnd: "301",
	/** Enter the node
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) nodetable index of the node we are entering.
	 * @memberof ByName
	 */
	NodeEntry: "002",
	/** Jump to another instruction
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	Jump: "003",
	/** Jump to another instruction if the last stack value is true.
	 * Remove the top argument on the stack regardless.
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfTrue: "103",
	/** Jump to another instruction if the last stack value is false
	 * Remove the top argument on the stack regardless.
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfFalse: "203",
	// Operators
	/** Load the variable at the index specified onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableLoad: "020",
	/** Save the last stack value to the specified variable
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableSet: "220",
	/** Load a null onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
 	 * @memberof ByName
	 */
	StaticNull: "021",
	/** Load a true onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
   * @memberof ByName
	 */
	StaticTrue: "121",
	/** Load a false onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
   * No parameters.
   * @memberof ByName
	 */
	StaticFalse: "221",
	/** Load a string onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) String Table index
   * @memberof ByName
	 */
	StaticString: "321",
	/** Load a float onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (float) the float
   * @memberof ByName
	 */
	StaticFloat: "022",
	/** Load an integer onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) the integer
   * @memberof ByName
	 */
	StaticInteger: "122",
	/** Use the specified stack values, add them and push the result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Add: "023",
	/** Use the specified stack values, subtract them and push the result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Subtract: "123",
	/** Use the specified stack values, multiply them and push the result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Multiply: "024",
	/** Use the specified stack values, divide the oldest by the newest and push the result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Divide: "124",
	/** Use the specified stack values, return the oldest mod'ed by the newest and push the result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Modulus: "224",
	/** UUse the specified stack values, push true on the stack if they are equal, false otherwise
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Equal: "025",
	/** Use the specified stack value and push the not value of it onto the stak
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the argument
   * @memberof ByName
	 */
	Not: "125",
	/** Use the specified stack values, push the AND result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	And: "026",
	/** Use the specified stack values, push the OR result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Or: "126",
	/** Use the specified stack values, push the OR result onto the stack
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Xor: "226",
	/** Use the specified stack values, push true if the older is greater than the newer onto the stack, false otherwise
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	GreaterThan: "027",
	/** Use the specified stack values, push true if the older is less than the newer onto the stack, false otherwise
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	LessThan: "127",
	/** Use the specified stack values, run the specified function and push the result onto the stack.
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
 	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) the number of arguments to reference
	 * 2..n - (StackOffset) - the argument stack offset
   * @memberof ByName
	 */
	FunctionReturn: "028",
	/** Use the specified stack values, run the specified function. Result is discarded.
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
 	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) the number of arguments to reference
	 * 2..n - (StackOffset) - the argument stack offset
   * @memberof ByName
	 */
	FunctionNoReturn: "128",

	// Options
	/** Add another option to the option stack. 
	 * 0 - (varInt) byte offset of the instruction after this option's instructions
	 * @memberof ByName
	 */
	PushOption: "50",
	/** Run all the options on the stack.
	 * No Parameters.
	 * @memberof ByName
	 */
	RunOptions: "51",
	
	/** Clear the top (arg0) values from the argument stack, or the entire stack (if arg0 is 255)
	 * 0 - (bytes) the number of values to clear from the stack. If this is 255, clear the whole stack.
	 * @memberof ByName
	 */
	ClearArguments: "375",
	/** Clear the top (arg0) values from the option stack, or the entire stack (if arg0 is 255)
	 * 0 - (bytes) the index to start clearing from the stack (top is 0)
	 * 1 - (bytes) the number of values to remove from the stack
	 * @memberof ByName
	 */
	ClearOptionStack: "376",
	/** We're starting an options list here. The options list should be clear. This is for debug only.
	 * At some point this will be removed.
	 * No parameters.
	 * @memberof ByName
	 */
	StartOptions: "377",
};

const byOpcode = {};
const names = {};

Object.keys(byName).forEach((name) => {
	names[name] = name;
	byName[name] = parseInt(byName[name], 8);
	byOpcode[byName[name]] = name;
});

export const ByName = Object.freeze(byName);

/** Command types by name (constant is the opcode in octal)
 * @name ByOpcode
 * @alias Commands.ByOpcode
 * @readonly
 * @enum {string}
 */
export const ByOpcode = Object.freeze(byName);

export const Names = Object.freeze(names);