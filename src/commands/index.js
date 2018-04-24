'use strict';

/** Command types by name (constant is the opcode in octal)
 * @name ByName
 * @readonly
 * @enum {string}
 */

const byName = {
	/** Do nothing.
	 * No parameters
	 * @memberof ByName
	 */
	Noop: "000",
	/** Display the current stack.
	 * No parameters.
	 * @memberof ByName
	 */
	ShowText: "001",
	/** Pass the current stack to the engine as a message
	 * No parameters.
	 * @memberof ByName
	 */
	RunCommand: "101",
	/** Enter the node
	 * 0 - (varInt) nodetable index of the node we are entering.
	 * @memberof ByName
	 */
	NodeEntry: "002",
	/** Jump to another instruction 
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	Jump: "003",
	/** Jump to another instruction if the last stack value is true
	 * remove the top argument on the stack.
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfTrue: "103",
	/** Jump to another instruction if the last stack value is false
	 * remove the top argument on the stack.
	 * 0 - (varInt) byte offset of the instruction list to jump to
	 * @memberof ByName
	 */
	JumpIfFalse: "203",

	// Operators
	/** Load the variable at the index specified onto the stack
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableLoad: "020",
	/** Save the last stack value to the specified variable
	 * 0 - (varInt) variabletable index
	 * @memberof ByName
	 */
	VariableSet: "220",
	/** Load a null onto the stack
   * No parameters.
 	 * @memberof ByName
	 */
	StaticNull: "021",
	/** Load a true onto the stack
   * No parameters.
   * @memberof ByName
	 */
	StaticTrue: "121",
	/** Load a false onto the stack
   * No parameters.
   * @memberof ByName
	 */
	StaticFalse: "221",
	/** Load a string onto the stack
   * 0 - (varInt) stringtable index
   * @memberof ByName
	 */
	StaticString: "321",
	/** Load a float onto the stack
   * 0 - (float) the float
   * @memberof ByName
	 */
	StaticFloat: "022",
	/** Load an integer onto the stack
   * 0 - (varInt) the integer
   * @memberof ByName
	 */
	StaticInteger: "122",
	/** Use the last 2 stack values, add them and push the result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Add: "023",
	/** Use the last 2 stack values, subtract the newest from the oldest and push the result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Subtract: "123",
	/** Use the last 2 stack values, multiply them and push the result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Multiply: "024",
	/** Use the last 2 stack values, divide the oldest by the newest and push the result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Divide: "124",
	/** Use the last 2 stack values, return the oldest mod'ed by the newest and push the result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Modulus: "224",
	/** Use the last 2 stack values, push true on the stack if they are equal, false otherwise
	 * No parameters.
   * @memberof ByName
	 */
	Equal: "025",
	/** Use the last stack value and push the not value of it onto the stak
	 * No parameters.
   * @memberof ByName
	 */
	Not: "125",
	/** Use the last 2 stack values, push the AND result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	And: "026",
	/** Use the last 2 stack values, push the OR result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Or: "126",
	/** Use the last 2 stack values, push the OR result onto the stack
	 * No parameters.
   * @memberof ByName
	 */
	Xor: "226",
	/** Use the last 2 stack values, push true if the older is greater than the newer onto the stack, false otherwise
	 * 0 - (byte) if this is not zero, push true if the older is greater than or equal the newer, false otherwise
   * @memberof ByName
	 */
	GreaterThan: "027",
	/** Use the last 2 stack values, push true if the older is less than the newer onto the stack, false otherwise
	 * 0 - (byte) if this is not zero, push true if the older is less than or equal the newer, false otherwise
   * @memberof ByName
	 */
	LessThan: "127",
	/** Use the last (arg1) stack values, run the specified function and push the result onto the stack.
	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) - number of arguments to pop off the stack
   * @memberof ByName
	 */
	FunctionReturn: "028",
	/** Use the last (arg1) stack values, run the specified function. Result is discarded.
	 * 0 - (varInt) functiontable index of the function to run
	 * 1 - (byte) - number of arguments to pop off the stack
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
	 * 0 - (bytes) the number of values to clear from the stack. If this is 255, clear the whole stack.
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

Object.keys(byName).forEach((name) => {
	byName[name] = parseInt(byName[name], 8);
	byOpcode[byName[name]] = name;
});

const ByName = Object.freeze(byName);

/** Command types by name (constant is the opcode in octal)
 * @name ByOpcode
 * @alias Commands.ByOpcode
 * @readonly
 * @enum {string}
 */
const ByOpcode = Object.freeze(byOpcode);

module.exports = Object.freeze({
	ByOpcode,
	ByName,
});