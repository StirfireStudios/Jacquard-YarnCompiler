'use strict';

/** Create a new private field store
 * @param {Object<string, *>} defaults The defaults that this class instance has
 * @param {Object<string, *>} attrs Object containing values that override the defaults
 * @returns {Object<string, *>} an object that is the private variables with new instances of any non-overridden values
 */
export function SetupPrivates(defaults, attrs) {
  if (attrs == null) attrs = {};

  const privates = {};
  Object.keys(defaults).forEach(fieldName => {
    if (attrs.hasOwnProperty(fieldName)) {
      privates[fieldName] = attrs[fieldName];
      return;
    }
    if (defaults[fieldName] instanceof Array) {
      privates[fieldName] = defaults[fieldName].map(item => { return item; });
      return;
    }
    if (typeof(defaults[fieldName]) === 'object') {
      privates[fieldName] = Object.assign({}, defaults[fieldName]);
      return;
    }
    privates[fieldName] = defaults[fieldName];
  });

  return privates;
}