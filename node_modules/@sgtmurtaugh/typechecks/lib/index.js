'use strict';

const config = require('config');

const TYPE_ARRAY = 'array';
const TYPE_BIGINT = 'bigint';
const TYPE_BIGINT_OBJECT = '[object BigInt]';
const TYPE_BOOLEAN = 'boolean';
const TYPE_BOOLEAN_OBJECT = '[object Boolean]';
const TYPE_DATE = 'date';
const TYPE_DATE_OBJECT = '[object Date]';
const TYPE_ERROR = 'error';
const TYPE_ERROR_OBJECT = '[object Error]';
const TYPE_FUNCTION = 'function';
const TYPE_FUNCTION_OBJECT = '[object Function]';
const TYPE_GENERATOR = 'generator';
const TYPE_GENERATOR_OBJECT = '[object Generator]';
const TYPE_GENERATOR_FUNCTION = 'generatorfunction';
const TYPE_GENERATOR_FUNCTION_OBJECT = '[object GeneratorFunction]';
const TYPE_MAP = 'map';
const TYPE_MAP_OBJECT = '[object Map]';
const TYPE_NULL = 'null';
const TYPE_NUMBER = 'number';
const TYPE_NUMBER_OBJECT = '[object Number]';
const TYPE_OBJECT = 'object';
const TYPE_OBJECT_OBJECT = '[object Object]';
const TYPE_REGEXP = 'regexp';
const TYPE_REGEXP_OBJECT = '[object RegExp]';
const TYPE_SET = 'set';
const TYPE_SET_OBJECT = '[object Set]';
const TYPE_STRING = 'string';
const TYPE_STRING_OBJECT = '[object String]';
const TYPE_SYMBOL = 'symbol';
const TYPE_SYMBOL_OBJECT = '[object Symbol]';
const TYPE_UNDEFINED = 'undefined';
const TYPE_UNKNOWN = 'unknown';
const TYPE_WEAKMAP = 'weakmap';
const TYPE_WEAKMAP_OBJECT = '[object WeakMap]';
const TYPE_WEAKSET = 'weakset';
const TYPE_WEAKSET_OBJECT = '[object WeakSet]';

module.exports = {

	'_isBooleanNumber': function (number, comparisonBase) {
		let bIs = false;

		if (this.isNumeric(number)) {
			if (this.isArray(comparisonBase)) {
				for (var numericBool of comparisonBase) {

					if ( (bIs = (numericBool === number)) ) break;
				}
			}
			else {
				bIs = (comparisonBase === number);
			}
		}
		return bIs;
	},

	/**
	 * getConfig
	 * @returns {Object}
	 * <p>Returns the loaded config Object
	 */
	'getConfig': function () {
		return config;
	},

	/**
	 * isCaseSensitiveValuesCheck
	 * @returns {*|boolean}
	 * <p>Returns the boolean config caseSensitiveValuesCheck. If not set the default 'false' will be used.
	 */
	'isCaseSensitiveValuesCheck': function () {
		return (this.getConfig().caseSensitiveValuesCheck || false);
	},

	/**
	 * typeOf
	 * @param obj
	 * @return {string}
	 * <p>Checks the type of the given parameter. Returns the following values:
	 * <dl>
	 *  <dt>{@code #TYPE_ARRAY}</dt>
	 *  <dd>If delegate method <code>isArray</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_FUNCTION}</dt>
	 *  <dd>If delegate method <code>isFunction</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_GENERATOR_FUNCTION}</dt>
	 *  <dd>If delegate method <code>isGeneratorFunction</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_BIGINT}</dt>
	 *  <dd>If delegate method <code>isBigInt</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_BOOLEAN}</dt>
	 *  <dd>If delegate method <code>isBoolean</code> returns true.</dd>

	 *  <dt>{@code #TYPE_NUMBER}</dt>
	 *  <dd>If delegate method <code>isNumber</code> returns true.</dd>

	 *  <dt>{@code #TYPE_STRING}</dt>
	 *  <dd>If delegate method <code>isString</code> returns true.</dd>

	 *  <dt>{@code #TYPE_SYMBOL}</dt>
	 *  <dd>If delegate method <code>isSymbol</code> returns true.</dd>

	 *  <dt>{@code #TYPE_NULL}</dt>
	 *  <dd>If delegate method <code>isNull</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_OBJECT}</dt>
	 *  <dd>
	 *      If the param is null or of type Object the String 'object' is returned. Special checked instances are:
	 *      <ul>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_DATE}</dt>
	 *                  <dd>If delegate method <code>isDate</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_MAP}</dt>
	 *                  <dd>If delegate method <code>isMap</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_RegExp}</dt>
	 *                  <dd>If delegate method <code>isRegExp</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_SET}</dt>
	 *                  <dd>If delegate method <code>isSet</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_WEAKER_MAP}</dt>
	 *                  <dd>If delegate method <code>isWeakerMap</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *          <li>
	 *              <dl>
	 *                  <dt>{@code #TYPE_WEAKER_SET}</dt>
	 *                  <dd>If delegate method <code>isWeakerSet</code> returns true.</dd>
	 *              </dl>
	 *          </li>
	 *      </ul>.
	 *      In these cases also the lowercase string of the type is returned.
	 *  </dd>
	 *
	 *  <dt>{@code #TYPE_UNDEFINED}</dt>
	 *  <dd>If delegate method <code>isArray</code> returns true.</dd>
	 *
	 *  <dt>{@code #TYPE_UNKNOWN}</dt>
	 *  <dd>If the param is not null and not one of the other mentioned types the value 'unknown' is returned.</dd>
	 * </dl>
	 */
	'typeOf': function (obj) {
		if (this.isUndefined(obj)) {
			return TYPE_UNDEFINED;
		}
		else if (this.isNull(obj)) {
			return TYPE_NULL;
		}
		else {
			// primitive types
			if (this.isBigInt(obj)) {
				return TYPE_BIGINT;
			}
			else if (this.isBoolean(obj)) {
				return TYPE_BOOLEAN;
			}
			else if (this.isNumeric(obj)) {
				return TYPE_NUMBER;
			}
			else if (this.isString(obj)) {
				return TYPE_STRING;
			}
			else if (this.isSymbol(obj)) {
				return TYPE_SYMBOL;
			}
			else if (this.isArray(obj)) {
				return TYPE_ARRAY;
			}
			else if (this.isFunction(obj)) {
				return TYPE_FUNCTION;
			}
			else if (this.isGeneratorFunction(obj)) {
				return TYPE_GENERATOR_FUNCTION;
			}
			else if (this.isObject(obj)) {
				if (this.isDate(obj)) {
					return TYPE_DATE;
				}
				else if (this.isError(obj)) {
					return TYPE_ERROR;
				}
				else if (this.isMap(obj)) {
					return TYPE_MAP;
				}
				else if (this.isRegExp(obj)) {
					return TYPE_REGEXP;
				}
				else if (this.isSet(obj)) {
					return TYPE_SET;
				}
				else if (this.isWeakMap(obj)) {
					return TYPE_WEAKMAP;
				}
				else if (this.isWeakSet(obj)) {
					return TYPE_WEAKSET;
				}
				else {
					return (typeof obj);
				}
			}
			else {
				return TYPE_UNKNOWN;
			}
		}
	},

	/**
	 * isArray
	 * @param obj
	 * @return {boolean}
	 * <p>Delegates to the <code>Array.isArray()</code> mehod. 
	 */
	'isArray': function (obj) {
		return (Array.isArray(obj));
	},

	/**
	 * isBigInt
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_BIGINT} or the deeptype is equals {@code #TYPE_BIGINT_OBJECT} true is
	 * returned.
	 */
	'isBigInt': function (obj) {
		return (TYPE_BIGINT === typeof obj || TYPE_BIGINT_OBJECT === toString.call(obj));
	},

	/**
	 * isBoolean
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is type of {@code #TYPE_BOOLEAN} or the deeptype is equals {@code #TYPE_BOOLEAN_OBJECT} true is
	 * returned.
	 */
	'isBoolean': function (obj) {
		return (TYPE_BOOLEAN === typeof obj || TYPE_BOOLEAN_OBJECT === toString.call(obj));
	},

	/**
	 * isBooleanValue
	 * @param obj
	 * @return {boolean}
	 * <p>If the object represents a true or false value true is returned.
	 */
	'isBooleanValue': function (obj) {
		return ( this.isTrue( obj ) || this.isFalse( obj ) );
	},

	/**
	 * isDate
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is type of {@code #TYPE_DATE} or the deeptype is equals {@code #TYPE_DATE_OBJECT} true is
	 * returned.
	 */
	'isDate': function (obj) {
		return (TYPE_DATE === typeof obj || TYPE_DATE_OBJECT === toString.call(obj));
	},

	/**
	 * isEmpty
	 * @param obj
	 * @return {boolean}
	 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined,
	 * or empty objects of type array, Map, Set, String, WeakMap or WeakSet.
	 */
	'isEmpty': function (obj) {
		if (this.isUndefined(obj) || this.isNull(obj)) {
			return true;
		}
		else if (this.isArray(obj)) {
			return (obj.length === 0);
		}
		else if (this.isMap(obj)) {
			return (obj.size === 0);
		}
		else if (this.isSet(obj)) {
			return (obj.size === 0);
		}
		else if (this.isString(obj)) {
			return (obj.trim().length === 0);
		}
		else if (this.isWeakMap(obj)) {
			return true;	// language related no check possible!
		}
		else if (this.isWeakSet(obj)) {
			return true;	// language related no check possible!
		}
		else if (this.isObject(obj)) {
			// because Object.keys(new Date()).length === 0;
			// we have to do some additional check
			return ( (Object.keys(obj).length === 0) && (obj.constructor === Object) );
		}
		return false;
	},

	/**
	 * isEmptyString
	 * @param string
	 * @return {boolean}
	 * <p>Checks the object for type String and its value on not empty.
	 */
	'isEmptyString': function (string) {
		return ( this.isString(string) && this.isEmpty(string) );
	},

	/**
	 * isError
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_ERROR} or the deeptype is equals {@code #TYPE_ERROR_OBJECT} true is
	 * returned.
	 */
	'isError': function (obj) {
		return (TYPE_ERROR === typeof obj || TYPE_ERROR_OBJECT === toString.call(obj));
	},

	/**
	 * isFalse
	 * @param obj
	 * @return {boolean}
	 * <p>TODO
	 */
	'isFalse': function (obj) {
		if (this.isBoolean(obj)) {
			return this.isFalseBoolean( obj );
		}
		else if (this.isNumeric(obj)) {
			return this.isFalseNumber(obj);
		}
		else if (this.isString(obj)) {
			return this.isFalseString(obj);
		}
		return false;
	},

	/**
	 * isFalseBoolean
	 * @param boolean {boolean}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isFalseBoolean': function (boolean) {
		return ( this.isBoolean(boolean) && ( false === boolean ) );
	},

	/**
	 * isFalseNumber
	 * @param number {number}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isFalseNumber': function (number) {
		return this._isBooleanNumber(number, config.falseValues.numeric);
		// let bIs = false;
		//
		// if (this.isNumeric(number)) {
		// 	if (this.isArray(config.falseValues.numeric)) {
		// 		for (var numericBool of config.falseValues.numeric) {
		//
		// 			if ( (bIs = (numericBool == number)) ) break;
		// 		}
		// 	}
		// 	else {
		// 		bIs = (config.falseValues.numeric == number);
		// 	}
		// }
		// return bIs;
	},

	/**
	 * isFalseString
	 * @param string {string}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isFalseString': function (string) {
		let bIs = false;

		if (this.isString(string)) {
			let trimmedString = string.trim();
			if ( !this.isCaseSensitiveValuesCheck() ) {
				trimmedString = trimmedString.toLowerCase();
			}

			let stringBooleanValues;
			if (string.trim().length > 1) {
				stringBooleanValues = config.falseValues.string;
			}
			else {
				stringBooleanValues = config.falseValues.character;
			}

			if (this.isArray(stringBooleanValues)) {
				for (let stringBool of stringBooleanValues) {
					stringBool = stringBool.trim();

					if ( !this.isCaseSensitiveValuesCheck() ) {
						stringBool = stringBool.toLowerCase();
					}

					if ( (bIs = (trimmedString === stringBool)) )
						break;
				}
			}
			else {
				stringBooleanValues = stringBooleanValues.trim();

				if ( !this.isCaseSensitiveValuesCheck() ) {
					stringBooleanValues = stringBooleanValues.toLowerCase();
				}

				bIs = (trimmedString === stringBooleanValues);
			}
		}
		return bIs;
	},

	/**
	 * isFunction
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is type of {@code #TYPE_FUNCTION} or the deeptype is equals {@code #TYPE_FUNCTION_OBJECT}. For
	 * params of type GenericFunction also true is returned.
	 */
	'isFunction': function (obj) {
		// Function check
		if (TYPE_FUNCTION === typeof obj || TYPE_FUNCTION_OBJECT === toString.call(obj)) {
			return true;
		}
		// GeneratorFunction check
		else if (this.isGeneratorFunction(obj)) {
			return true
		}
		return false;
	},

	/**
	 * isGeneratorFunction
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_GENERATOR_FUNCTION} or the deeptype is equals
	 * {@code #TYPE_GENERATOR_FUNCTION_OBJECT} true is returned.
	 * Additionaly the constructor may be checked to determine a GenericFunction.
	 */
	'isGeneratorFunction': function (obj) {
		// Function check
		if (TYPE_GENERATOR_FUNCTION === typeof obj || TYPE_GENERATOR_FUNCTION_OBJECT === toString.call(obj)) {
			return true;
		}
		// Constructor type check for GenericFunction
		else if (this.isNotEmpty(obj)) {
			var constructor = obj.constructor;
			if (!constructor) {
				return false;
			}
			if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
				return true;
			}
//TODO still necessary?
			// Generator check
			// return this.isGenerator(constructor.prototype);
		}
		return false;
	},

	/**
	 * isGenerator
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_GENERATOR} or the deeptype is equals {@code #TYPE_GENERATOR_OBJECT} true
	 * is returned.
	 * Otherwise when the type of the param is GeneratorFunction, an additional Generator check will be executed.
	 */
	'isGenerator': function (obj) {
		if (TYPE_GENERATOR === typeof obj || TYPE_GENERATOR_OBJECT === toString.call(obj)) {
			return true;
		}
		else if (this.isGeneratorFunction(obj)) {
			return this.isGenerator(obj.prototype);
		}
		return false;
	},

	/**
	 * isJSONString
	 * @param string
	 * @return {boolean}
	 * <p>Checks for type 'string'. If true a JSON parse tries to get a json object.
	 * When no exeption is thrown true will be returned otherwise false.
	 * Attention: Numbers, booleans and null will also return true - these are valid JSON values!
	 */
	'isJSONString': function (string) {
		let bIs = false;

		if (this.isString(string)) {
			try {
				JSON.parse(string);
				bIs = true;
			}
			catch (e) {}
		}
		return bIs;
	},

	/**
	 * isMap
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_MAP} or the deeptype is equals {@code #TYPE_MAP_OBJECT} true is
	 * returned.
	 */
	'isMap': function (obj) {
		return (TYPE_MAP === typeof obj || TYPE_MAP_OBJECT === toString.call(obj));
	},

	/**
	 * isNaN
	 * @param obj
	 * @return {boolean}
	 * <p>Delegates to <code>isNaN(obj)</code>.
	 */
	'isNaN': function (obj) {
		return isNaN(obj);
	},

	/**
	 * isNotEmpty
	 * @param obj
	 * @return {boolean}
	 * <p>Delegates to <code>isEmpty</code> and returns the inverted value.
	 */
	'isNotEmpty': function (obj) {
		return (!this.isEmpty(obj));
	},

	/**
	 * isNotEmptyString
	 * @param string
	 * @return {boolean}
	 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
	 * empty Array or an empty String, otherwise true will be returned.
	 */
	'isNotEmptyString': function (string) {
		return ( this.isString(string) && !this.isEmpty(string) );
	},

	/**
	 * isNull
	 * @param obj
	 * @return {boolean}
	 * <p>A null check is executed.
	 */
	'isNull': function (obj) {
		return (null === obj);
	},

	/**
	 * isNumeric
	 * @param number
	 * @returns {boolean}
	 * <p>If the param is typeof {@code #TYPE_NUMBER} or the deeptype is equals {@code #TYPE_NUMBER_OBJECT} true is
	 * returned.
	 */
	'isNumeric': function (number) {
		// TODO Is current check sufficiant?
//		return ( (!isNaN(number) && (!isNaN(parseFloat(number))) && isFinite(number)) );
//		return ( !isNaN(number) && 'number' === this.typeOf(number) );
		return (TYPE_NUMBER === typeof number || TYPE_NUMBER_OBJECT === toString.call(number));
	},

	/**
	 * isObject
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_OBJECT} or the deeptype is equals {@code #TYPE_OBJECT_OBJECT} true is
	 * returned.
	 */
	'isObject': function (obj) {
		return (TYPE_OBJECT === typeof obj || TYPE_OBJECT_OBJECT === toString.call(obj));
	},

	/**
	 * isRegExp
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_REGEXP} or the deeptype is equals {@code #TYPE_REGEXP_OBJECT} true is
	 * returned.
	 */
	'isRegExp': function (obj) {
		return (TYPE_REGEXP=== typeof obj || TYPE_REGEXP_OBJECT === toString.call(obj));
	},

	/**
	 * isSet
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_SET} or the deeptype is equals {@code #TYPE_SET_OBJECT} true is
	 * returned.
	 */
	'isSet': function (obj) {
		return (TYPE_SET === typeof obj || TYPE_SET_OBJECT === toString.call(obj));
	},

	/**
	 * isString
	 * @param string
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_STRING} or the deeptype is equals {@code #TYPE_STRING_OBJECT} true is
	 * returned.
	 */
	'isString': function (string) {
		return (TYPE_STRING === typeof string || TYPE_STRING_OBJECT === toString.call(string));
	},

	/**
	 * isSymbol
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_SYMBOL} or the deeptype is equals {@code #TYPE_SYMBOL_OBJECT} true is
	 * returned.
	 */
	'isSymbol': function (obj) {
		return (TYPE_SYMBOL === typeof obj || TYPE_SYMBOL_OBJECT === toString.call(obj));
	},

	/**
	 * isTrue
	 * @param obj
	 * @return {boolean}
	 * <p>TODO
	 */
	'isTrue': function (obj) {
		if (this.isBoolean(obj)) {
			return this.isTrueBoolean(obj);
		}
		else if (this.isNumeric(obj)) {
			return this.isTrueNumber(obj);
		}
		else if (this.isString(obj)) {
			return this.isTrueString(obj);
		}
		return false;
	},

	/**
	 * isTrueBoolean
	 * @param boolean {boolean}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isTrueBoolean': function (boolean) {
		return ( this.isBoolean(boolean) && ( true === boolean ) );
	},

	/**
	 * isTrueNumber
	 * @param number {number}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isTrueNumber': function (number) {
		return this._isBooleanNumber(number, config.trueValues.numeric);
		// let bIs = false;
		//
		// if (this.isNumeric(number)) {
		// 	if (this.isArray(config.trueValues.numeric)) {
		// 		for (var numericBool of config.trueValues.numeric) {
		//
		// 			if ( (bIs = (numericBool == number)) )
		// 				break;
		// 		}
		// 	}
		// 	else {
		// 		bIs = (config.trueValues.numeric == number);
		// 	}
		// }
		// return bIs;
	},

	/**
	 * isTrueString
	 * @param string {string}
	 * @return {boolean}
	 * <p>TODO
	 */
	'isTrueString': function (string) {
		let bIs = false;

		if (this.isString(string)) {
			let trimmedString = string.trim();
			if ( !this.isCaseSensitiveValuesCheck() ) {
				trimmedString = trimmedString.toLowerCase();
			}

			let stringBooleanValues;
			if (string.trim().length > 1) {
				stringBooleanValues = config.trueValues.string;
			}
			else {
				stringBooleanValues = config.trueValues.character;
			}

			if (this.isArray(stringBooleanValues)) {
				for (let stringBool of stringBooleanValues) {
					stringBool = stringBool.trim();

					if ( !this.isCaseSensitiveValuesCheck() ) {
						stringBool = stringBool.toLowerCase();
					}

					if ( (bIs = (trimmedString === stringBool)) )
						break;
				}
			}
			else {
				stringBooleanValues = stringBooleanValues.trim();

				if ( !this.isCaseSensitiveValuesCheck() ) {
					stringBooleanValues = stringBooleanValues.toLowerCase();
				}

				bIs = (trimmedString === stringBooleanValues);
			}
		}
		return bIs;
	},

	/**
	 * isUndefined
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_UNDEFINED} true is returned.
	 */
	'isUndefined': function (obj) {
		return (TYPE_UNDEFINED === typeof obj);
	},

	/**
	 * isUnknown
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_UNKNOWN} true is returned.
	 * This is not a valid type. It signals that there is no other successful type check the matches/evaluates the type
	 */
	'isUnknown': function (obj) {
		return (TYPE_UNKNOWN === this.typeOf(obj));
	},

	/**
	 * isWeakMap
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_WEAKMAP} or the deeptype is equals {@code #TYPE_WEAKMAP_OBJECT} true is
	 * returned.
	 */
	'isWeakMap': function (obj) {
		return (TYPE_WEAKMAP === typeof obj || TYPE_WEAKMAP_OBJECT === toString.call(obj));
	},

	/**
	 * isWeakSet
	 * @param obj
	 * @return {boolean}
	 * <p>If the param is typeof {@code #TYPE_WEAKSET} or the deeptype is equals {@code #TYPE_WEAKSET_OBJECT} true is
	 * returned.
	 */
	'isWeakSet': function (obj) {
		return (TYPE_WEAKSET === typeof obj || TYPE_WEAKSET_OBJECT === toString.call(obj));
	},

};
