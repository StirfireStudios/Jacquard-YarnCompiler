'use strict';

/** Command types by name (constant is the opcode in octal)
 * @name ByName
 * @readonly
 * @enum {string}
 */
export const byName = {
	/** Do nothing.
	 * Octal: 0, Decimal: 0, Hex: 0
	 * This is a valid Logic File instruction.
	 * This is a valid Dialog File instruction.
	 * No parameters
	 * @memberof ByName
	 */
	Noop: "000",
	/** Display the last X arguments on the stack.
	 * Octal: 1, Decimal: 1, Hex: 1
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	ShowText: "001",
	/** Pass the the last X arguments on the stack to the engine as a message
	 * Octal: 101, Decimal: 65, Hex: 41
	 * This is a valid Logic File instruction.
 	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	RunCommand: "101",
	/** Display the given dialog block
	 * Octal: 201, Decimal: 129, Hex: 81
 	 * This is a valid Logic File instruction. 
 	 * 0 - (varBytes) - the dialog block reference in the Dialog File
	 * 1 - (varInt) - the character reference in the Dialog File (or -1 if no character)
	 * @memberof ByName
	 */
	ShowDialogBlock: "201",
	/** End the Dialog Block
	 * Octal: 301, Decimal: 193, Hex: C1
	 * This is a valid Dialog File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	DialogBlockEnd: "301",
	/** Enter the node
	 * Octal: 2, Decimal: 2, Hex: 2
	 * This is a valid Logic File instruction. 
	 * 0 - (varInt) nodetable index of the node we are entering.
	 * @memberof ByName
	 */
	NodeEntry: "002",
	/** Jump to another instruction
	 * Octal: 3, Decimal: 3, Hex: 3
	 * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	Jump: "003",
	/** Jump to another instruction if the last stack value is true.
	 * Octal: 103, Decimal: 67, Hex: 43
	 * Remove the top argument on the stack regardless.
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfTrue: "103",
	/** Jump to another instruction if the last stack value is false
	 * Octal: 203, Decimal: 131, Hex: 83
	 * Remove the top argument on the stack regardless.
   * This is a valid Logic File instruction. 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfFalse: "203",

	// Operators
	/** Load the variable at the index specified onto the stack
	 * Octal: 20, Decimal: 16, Hex: 10
	 * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableLoad: "020",
	/** Save the last stack value to the specified variable
	 * Octal: 220, Decimal: 144 Hex: 90
	 * This is a valid Logic File instruction. 
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableSet: "220",
	/** Load a null onto the stack
	 * Octal: 21, Decimal: 17 Hex: 11
	 * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
 	 * @memberof ByName
	 */
	StaticNull: "021",
	/** Load a true onto the stack
	 * Octal: 121, Decimal: 81 Hex: 51
	 * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * No parameters.
   * @memberof ByName
	 */
	StaticTrue: "121",
	/** Load a false onto the stack
	 * Octal: 221, Decimal: 145 Hex: 91
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
   * No parameters.
   * @memberof ByName
	 */
	StaticFalse: "221",
	/** Load a string onto the stack
	 * Octal: 221, Decimal: 209 Hex: D1
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) String Table index
   * @memberof ByName
	 */
	StaticString: "321",
	/** Load a float onto the stack
	 * Octal: 22, Decimal: 18 Hex: 12
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (float) the float
   * @memberof ByName
	 */
	StaticFloat: "022",
	/** Load an integer onto the stack
	 * Octal: 122, Decimal: 82 Hex: 52
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (varInt) the integer
   * @memberof ByName
	 */
	StaticInteger: "122",
	/** Use the specified stack values, add them and push the result onto the stack
	 * Octal: 23, Decimal: 19 Hex: 13
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Add: "023",
	/** Use the specified stack values, subtract them and push the result onto the stack
	 * Octal: 123, Decimal: 83 Hex: 53
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Subtract: "123",
	/** Use the specified stack values, multiply them and push the result onto the stack
	 * Octal: 24, Decimal: 20 Hex: 14
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Multiply: "024",
	/** Use the specified stack values, divide the oldest by the newest and push the result onto the stack
	 * Octal: 124, Decimal: 84 Hex: 54
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Divide: "124",
	/** Use the specified stack values, return the oldest mod'ed by the newest and push the result onto the stack
	 * Octal: 224, Decimal: 148 Hex: 94
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Modulus: "224",
	/** Use the specified stack values, push true on the stack if they are equal, false otherwise
	 * Octal: 25, Decimal: 21 Hex: 15
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Equal: "025",
	/** Use the specified stack value and push the not value of it onto the stack
	 * Octal: 125, Decimal: 85 Hex: 55
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the argument
   * @memberof ByName
	 */
	Not: "125",
	/** Use the specified stack values, push the AND result onto the stack
	 * Octal: 26, Decimal: 22 Hex: 16
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	And: "026",
	/** Use the specified stack values, push the OR result onto the stack
	 * Octal: 126, Decimal: 86 Hex: 56
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Or: "126",
	/** Use the specified stack values, push the OR result onto the stack
	 * Octal: 226, Decimal: 150 Hex: 96
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	Xor: "226",
	/** Use the specified stack values, push true if the older is greater than the newer onto the stack, false otherwise
	 * Octal: 27, Decimal: 23 Hex: 17
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	GreaterThan: "027",
	/** Use the specified stack values, push true if the older is less than the newer onto the stack, false otherwise
	 * Octal: 127, Decimal: 87 Hex: 57
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (StackOffset) the left argument
	 * 1 - (StackOffset) the right argument
   * @memberof ByName
	 */
	LessThan: "127",
	/** Use the specified stack values, run the specified function and push the result onto the stack.
	 * Octal: 30, Decimal: 24, Hex: 18
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
 	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) the number of arguments to reference
	 * 2..n - (StackOffset) - the argument stack offset
   * @memberof ByName
	 */
	FunctionReturn: "030",
	/** Use the specified stack values, run the specified function. Result is discarded.
	 * Octal: 130, Decimal: 88, Hex: 58
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
 	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) the number of arguments to reference
	 * 2..n - (StackOffset) - the argument stack offset
   * @memberof ByName
	 */
	FunctionNoReturn: "130",

	// Options
	/** Add another option to the option stack. 
	 * Octal: 50, Decimal: 40, Hex: 28
	 * This is a valid Logic File instruction.
	 * 0 - (varInt) byte offset of the instruction after this option's instructions
	 * @memberof ByName
	 */
	PushOption: "50",
	/** Run all the options on the stack. (Should clear the option stack) 
	 * Octal: 51, Decimal: 41, Hex: 29
	 * This is a valid Logic File instruction.
	 * No Parameters.
	 * @memberof ByName
	 */
	RunOptions: "51",
	/** Clear the top (arg1) values starting from arg0 off the argument stack, or to the end (if arg1 is 255) 
	 * Octal: 375, Decimal: 253, Hex: FD
   * This is a valid Logic File instruction. 
	 * This is a valid Dialog File instruction.
	 * 0 - (bytes) the index to start clearing from the stack (top is 0) 
	 * 1 - (bytes) the number of values to clear from the stack. If this is 255, clear to the end.
	 * @memberof ByName
	 */
	ClearArguments: "375",
	/** Clear the top (arg1) values starting from arg0 off the option stack, or the end (if arg1 is 255) 
	 * Octal: 376, Decimal: 254, Hex: FE
   * This is a valid Logic File instruction. 
 	 * 0 - (bytes) the index to start clearing from the stack (top is 0)
	 * 1 - (bytes) the number of values to remove from the stack, If this is 255, clear to the end.
	 * @memberof ByName
	 */
	ClearOptionStack: "376",
	/** Stop execution.
	 * Octal:377, Decimal: 255, Hex: FF
	 * At some point this will be removed.
 	 * This is a valid Logic File instruction.
	 * No parameters.
	 * @memberof ByName
	 */
	StopExecution: "377",
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