'use strict';

/** Command types by name (constant is the opcode in octal)
 * @name ByName
 * @readonly
 * @enum {string}
 */
const byName = {
	/**
	 * @memberof ByName
	 */
	Noop: "000",
	Text: "001",
	NodeEntry: "101",
	Jump: "002",
	JumpIfTrue: "102",
	JumpIfFalse: "202",
	Command: "003",
	Function: "103",

	// Operators
	VariableLoad: "020",
	VariableSet: "220",
	StaticNull: "021",
	StaticTrue: "121",
	StaticFalse: "221",
	StaticString: "321",
	StaticFloat: "022",
	StaticInteger: "122",
	Add: "023",
	Subtract: "123",
	Multiply: "024",
	Divide: "124",
	Modulus: "224",
	Equal: "025",
	Not: "125",
	And: "026",
	Or: "126",
	Xor: "226",
	GreaterThan: "027",
	LessThan: "127",

	// Options
	PushOption: "50",
	RunOptions: "51",

	ClearArguments: "375",
	ClearOptionStack: "376",
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