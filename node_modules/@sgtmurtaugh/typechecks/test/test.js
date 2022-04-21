const expect    = require("chai").expect;
const assert    = require("chai").assert;
const typecheck = require("../lib");

/*
  Test Variables
 */
const varEmptyArray = [];
const varArray = [1, 2, 3];
const varBigInt = 42n;
const varBigIntObject = BigInt(42n);
const varBooleanFalse = false;
const varBooleanObjectFalse = Boolean(false);
const varBooleanTrue = true;
const varBooleanObjectTrue = Boolean(true);
const varDate = new Date();
const varError = new Error("ErrorMessage");
const varFunction = () => {};
const varGeneratorFunction = function * () {
    console.log('This will be executed first.');
    yield 'Hello World';
};
const varGenerator = varGeneratorFunction.prototype;
const varJSONSStringObjectEmpty = '{}';
const varJSONSStringObject = '{"key": "value"}';
const varJSONSStringArray = '["val1", "val2", "val3"]';
const varMapEmpty = new Map();
const varMap = new Map([
    ['tomato', 10],
    ['cucumber', 5],
    ['onion', 3]
]);
const varNull = null;
const varNumber = 42;
const varNumberObject = Number(42);
const varObjectEmpty = {};
const varObject = {
    "key": ["val1", "val2", "val3"]
};
const varRegExp = /\d/;
const varSetEmpty = new Set();
const varSet = new Set([
    "oranges",
    "apples",
    "bananas"
]);
const varStringEmpty = '';
const varString = 'Hello World!';
const varStringObject = String('Hello World!');
const varSymbol = Symbol('foo');
let varUndefined;
const varWeakMapEmpty = new WeakMap();
const varWeakMap = new WeakMap([
    [new Object('tomato'), 10],
    [new Object('cucumber'), 5],
    [new Object('onion'), 3]
]);
const varWeakSetEmpty = new WeakSet();
const varWeakSet = new WeakSet([
    new Object("oranges"),
    new Object("apples"),
    new Object("bananas")
]);



describe("Type Checker", function() {
    describe("caseSensitiveValuesCheck", function() {
        it("config value lookup", function () {
            let isCaseSensitiveValuesCheck = typecheck.isCaseSensitiveValuesCheck();
            assert.isBoolean(isCaseSensitiveValuesCheck, 'isCaseSensitiveValuesCheck');
        });
    });


    describe("typeOf", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.typeOf(varBigInt)).to.equal('bigint');
                expect(typecheck.typeOf(varBigIntObject)).to.equal('bigint');
            });

            it("boolean", function () {
                expect(typecheck.typeOf(varBooleanFalse)).to.equal('boolean');
                expect(typecheck.typeOf(varBooleanObjectFalse)).to.equal('boolean');
                expect(typecheck.typeOf(varBooleanTrue)).to.equal('boolean');
                expect(typecheck.typeOf(varBooleanObjectTrue)).to.equal('boolean');
            });

            it("number", function () {
                expect(typecheck.typeOf(varNumber)).to.equal('number');
                expect(typecheck.typeOf(varNumberObject)).to.equal('number');
            });

            it("string", function () {
                expect(typecheck.typeOf(varStringEmpty)).to.equal('string');
                expect(typecheck.typeOf(varString)).to.equal('string');
                expect(typecheck.typeOf(varStringObject)).to.equal('string');
            });

            it("symbol", function () {
                expect(typecheck.typeOf(varSymbol)).to.equal('symbol');
            });

            it("null", function () {
                expect(typecheck.typeOf(varNull)).to.equal('null');
            });

            it("undefined", function () {
                expect(typecheck.typeOf(varUndefined)).to.equal('undefined');
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.typeOf(varEmptyArray)).to.equal('array');
                expect(typecheck.typeOf(varArray)).to.equal('array');
            });

            it("Date", function () {
                expect(typecheck.typeOf(varDate)).to.equal('date');
            });

            it("Error", function () {
                expect(typecheck.typeOf(varError)).to.equal('error');
            });

            it("Map", function () {
                expect(typecheck.typeOf(varMapEmpty)).to.equal('map');
                expect(typecheck.typeOf(varMap)).to.equal('map');
            });

            it("Object", function () {
                expect(typecheck.typeOf(varObjectEmpty)).to.equal('object');
                expect(typecheck.typeOf(varObject)).to.equal('object');
            });

            it("RegExp", function () {
                expect(typecheck.typeOf(varRegExp)).to.equal('regexp');
            });

            it("Set", function () {
                expect(typecheck.typeOf(varSetEmpty)).to.equal('set');
                expect(typecheck.typeOf(varSet)).to.equal('set');
            });

            it("WeakMap", function () {
                expect(typecheck.typeOf(varWeakMapEmpty)).to.equal('weakmap');
                expect(typecheck.typeOf(varWeakMap)).to.equal('weakmap');
            });

            it("WeakSet", function () {
                expect(typecheck.typeOf(varWeakSetEmpty)).to.equal('weakset');
                expect(typecheck.typeOf(varWeakSet)).to.equal('weakset');
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.typeOf(varFunction)).to.equal('function');
                expect(typecheck.typeOf(varGeneratorFunction)).to.equal('function');
            });
        });
    });


    describe("isArray", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isArray(varBigInt)).is.false;
                expect(typecheck.isArray(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isArray(varBooleanFalse)).is.false;
                expect(typecheck.isArray(varBooleanObjectFalse)).is.false;
                expect(typecheck.isArray(varBooleanTrue)).is.false;
                expect(typecheck.isArray(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isArray(varNumber)).is.false;
                expect(typecheck.isArray(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isArray(varStringEmpty)).is.false;
                expect(typecheck.isArray(varString)).is.false;
                expect(typecheck.isArray(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isArray(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isArray(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isArray(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isArray(varEmptyArray)).is.true;
                expect(typecheck.isArray(varArray)).is.true;
            });

            it("Date", function () {
                expect(typecheck.isArray(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isArray(varError)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isArray(varMapEmpty)).is.false;
                expect(typecheck.isArray(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isArray(varObjectEmpty)).is.false;
                expect(typecheck.isArray(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isArray(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isArray(varSetEmpty)).is.false;
                expect(typecheck.isArray(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isArray(varWeakMapEmpty)).is.false;
                expect(typecheck.isArray(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isArray(varWeakSetEmpty)).is.false;
                expect(typecheck.isArray(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isArray(varFunction)).is.false;
                expect(typecheck.isArray(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isBoolean", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isBoolean(varBigInt)).is.false;
                expect(typecheck.isBoolean(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isBoolean(varBooleanFalse)).is.true;
                expect(typecheck.isBoolean(varBooleanObjectFalse)).is.true;
                expect(typecheck.isBoolean(varBooleanTrue)).is.true;
                expect(typecheck.isBoolean(varBooleanObjectTrue)).is.true;
            });

            it("number", function () {
                expect(typecheck.isBoolean(varNumber)).is.false;
                expect(typecheck.isBoolean(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isBoolean(varStringEmpty)).is.false;
                expect(typecheck.isBoolean(varString)).is.false;
                expect(typecheck.isBoolean(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isBoolean(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isBoolean(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isBoolean(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isBoolean(varEmptyArray)).is.false;
                expect(typecheck.isBoolean(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isBoolean(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isBoolean(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isBoolean(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isBoolean(varMapEmpty)).is.false;
                expect(typecheck.isBoolean(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isBoolean(varObjectEmpty)).is.false;
                expect(typecheck.isBoolean(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isBoolean(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isBoolean(varSetEmpty)).is.false;
                expect(typecheck.isBoolean(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isBoolean(varWeakMapEmpty)).is.false;
                expect(typecheck.isBoolean(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isBoolean(varWeakSetEmpty)).is.false;
                expect(typecheck.isBoolean(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isBoolean(varFunction)).is.false;
                expect(typecheck.isBoolean(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                if ( typecheck.isNotEmpty(typecheck.getConfig().falseValues)
                    && typecheck.isNotEmpty(typecheck.getConfig().falseValues.character) ) {

                    if ( typecheck.isArray(typecheck.getConfig().falseValues.character) ) {
                        for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                            expect(typecheck.isBoolean(falseChar)).is.false;
                        }
                    }
                    else {
                        expect(typecheck.isBoolean(typecheck.getConfig().falseValues.character)).is.false;
                    }
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isBoolean(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isBoolean(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isBoolean(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isBoolean(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isBoolean(trueString)).is.false;
                }
            });
        });
    });


    describe("isBooleanValue", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isBooleanValue(varBigInt)).is.false;
                expect(typecheck.isBooleanValue(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isBooleanValue(varBooleanFalse)).is.true;
                expect(typecheck.isBooleanValue(varBooleanObjectFalse)).is.true;
                expect(typecheck.isBooleanValue(varBooleanTrue)).is.true;
                expect(typecheck.isBooleanValue(varBooleanObjectTrue)).is.true;
            });

            it("number", function () {
                expect(typecheck.isBooleanValue(varNumber)).is.false;
                expect(typecheck.isBooleanValue(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isBooleanValue(varStringEmpty)).is.false;
                expect(typecheck.isBooleanValue(varString)).is.false;
                expect(typecheck.isBooleanValue(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isBooleanValue(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isBooleanValue(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isBooleanValue(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isBooleanValue(varEmptyArray)).is.false;
                expect(typecheck.isBooleanValue(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isBooleanValue(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isBooleanValue(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isBooleanValue(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isBooleanValue(varMapEmpty)).is.false;
                expect(typecheck.isBooleanValue(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isBooleanValue(varObjectEmpty)).is.false;
                expect(typecheck.isBooleanValue(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isBooleanValue(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isBooleanValue(varSetEmpty)).is.false;
                expect(typecheck.isBooleanValue(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isBooleanValue(varWeakMapEmpty)).is.false;
                expect(typecheck.isBooleanValue(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isBooleanValue(varWeakSetEmpty)).is.false;
                expect(typecheck.isBooleanValue(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isBooleanValue(varFunction)).is.false;
                expect(typecheck.isBooleanValue(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isBooleanValue(falseChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isBooleanValue(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isBooleanValue(typecheck.getConfig().falseValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isBooleanValue(falseString)).is.true;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isBooleanValue(trueChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isBooleanValue(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isBooleanValue(typecheck.getConfig().trueValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isBooleanValue(trueString)).is.true;
                }
            });
        });
    });


    describe("isDate", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isDate(varBigInt)).is.false;
                expect(typecheck.isDate(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isDate(varBooleanFalse)).is.false;
                expect(typecheck.isDate(varBooleanObjectFalse)).is.false;
                expect(typecheck.isDate(varBooleanTrue)).is.false;
                expect(typecheck.isDate(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isDate(varNumber)).is.false;
                expect(typecheck.isDate(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isDate(varStringEmpty)).is.false;
                expect(typecheck.isDate(varString)).is.false;
                expect(typecheck.isDate(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isDate(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isDate(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isDate(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isDate(varEmptyArray)).is.false;
                expect(typecheck.isDate(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isDate(varDate)).is.true;
            });

            it("Error", function () {
                expect(typecheck.isDate(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isDate(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isDate(varMapEmpty)).is.false;
                expect(typecheck.isDate(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isDate(varObjectEmpty)).is.false;
                expect(typecheck.isDate(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isDate(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isDate(varSetEmpty)).is.false;
                expect(typecheck.isDate(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isDate(varWeakMapEmpty)).is.false;
                expect(typecheck.isDate(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isDate(varWeakSetEmpty)).is.false;
                expect(typecheck.isDate(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isDate(varFunction)).is.false;
                expect(typecheck.isDate(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isEmpty", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isEmpty(varBigInt)).is.false;
                expect(typecheck.isEmpty(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isEmpty(varBooleanFalse)).is.false;
                expect(typecheck.isEmpty(varBooleanObjectFalse)).is.false;
                expect(typecheck.isEmpty(varBooleanTrue)).is.false;
                expect(typecheck.isEmpty(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isEmpty(varNumber)).is.false;
                expect(typecheck.isEmpty(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isEmpty(varStringEmpty)).is.true;
                expect(typecheck.isEmpty(varString)).is.false;
                expect(typecheck.isEmpty(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isEmpty(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isEmpty(varNull)).is.true;
            });

            it("undefined", function () {
                expect(typecheck.isEmpty(varUndefined)).is.true;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isEmpty(varEmptyArray)).is.true;
                expect(typecheck.isEmpty(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isEmpty(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isEmpty(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isEmpty(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isEmpty(varMapEmpty)).is.true;
                expect(typecheck.isEmpty(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isEmpty(varObjectEmpty)).is.true;
                expect(typecheck.isEmpty(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isEmpty(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isEmpty(varSetEmpty)).is.true;
                expect(typecheck.isEmpty(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isEmpty(varWeakMapEmpty)).is.true;
                expect(typecheck.isEmpty(varWeakMap)).is.true;
            });

            it("WeakSet", function () {
                expect(typecheck.isEmpty(varWeakSetEmpty)).is.true;
                expect(typecheck.isEmpty(varWeakSet)).is.true;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isEmpty(varFunction)).is.false;
                expect(typecheck.isEmpty(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isEmptyString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isEmptyString(varBigInt)).is.false;
                expect(typecheck.isEmptyString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isEmptyString(varBooleanFalse)).is.false;
                expect(typecheck.isEmptyString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isEmptyString(varBooleanTrue)).is.false;
                expect(typecheck.isEmptyString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isEmptyString(varNumber)).is.false;
                expect(typecheck.isEmptyString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isEmptyString(varStringEmpty)).is.true;
                expect(typecheck.isEmptyString(varString)).is.false;
                expect(typecheck.isEmptyString(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isEmptyString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isEmptyString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isEmptyString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isEmptyString(varEmptyArray)).is.false;
                expect(typecheck.isEmptyString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isEmptyString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isEmptyString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isEmptyString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isEmptyString(varMapEmpty)).is.false;
                expect(typecheck.isEmptyString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isEmptyString(varObjectEmpty)).is.false;
                expect(typecheck.isEmptyString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isEmptyString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isEmptyString(varSetEmpty)).is.false;
                expect(typecheck.isEmptyString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isEmptyString(varWeakMapEmpty)).is.false;
                expect(typecheck.isEmptyString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isEmptyString(varWeakSetEmpty)).is.false;
                expect(typecheck.isEmptyString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isEmptyString(varFunction)).is.false;
                expect(typecheck.isEmptyString(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isFalse", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isFalse(varBigInt)).is.false;
                expect(typecheck.isFalse(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isFalse(varBooleanFalse)).is.true;
                expect(typecheck.isFalse(varBooleanObjectFalse)).is.true;
                expect(typecheck.isFalse(varBooleanTrue)).is.false;
                expect(typecheck.isFalse(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isFalse(varNumber)).is.false;
                expect(typecheck.isFalse(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isFalse(varStringEmpty)).is.false;
                expect(typecheck.isFalse(varString)).is.false;
                expect(typecheck.isFalse(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isFalse(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isFalse(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isFalse(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isFalse(varEmptyArray)).is.false;
                expect(typecheck.isFalse(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isFalse(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isFalse(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isFalse(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isFalse(varMapEmpty)).is.false;
                expect(typecheck.isFalse(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isFalse(varObjectEmpty)).is.false;
                expect(typecheck.isFalse(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isFalse(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isFalse(varSetEmpty)).is.false;
                expect(typecheck.isFalse(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isFalse(varWeakMapEmpty)).is.false;
                expect(typecheck.isFalse(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isFalse(varWeakSetEmpty)).is.false;
                expect(typecheck.isFalse(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isFalse(varFunction)).is.false;
                expect(typecheck.isFalse(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isFalse(falseChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isFalse(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isFalse(typecheck.getConfig().falseValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isFalse(falseString)).is.true;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isFalse(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isFalse(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalse(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isFalse(trueString)).is.false;
                }
            });
        });
    });


    describe("isFalseBoolean", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isFalseBoolean(varBigInt)).is.false;
                expect(typecheck.isFalseBoolean(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isFalseBoolean(varBooleanFalse)).is.true;
                expect(typecheck.isFalseBoolean(varBooleanObjectFalse)).is.true;
                expect(typecheck.isFalseBoolean(varBooleanTrue)).is.false;
                expect(typecheck.isFalseBoolean(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isFalseBoolean(varNumber)).is.false;
                expect(typecheck.isFalseBoolean(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isFalseBoolean(varStringEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varString)).is.false;
                expect(typecheck.isFalseBoolean(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isFalseBoolean(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isFalseBoolean(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isFalseBoolean(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isFalseBoolean(varEmptyArray)).is.false;
                expect(typecheck.isFalseBoolean(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isFalseBoolean(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isFalseBoolean(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isFalseBoolean(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isFalseBoolean(varMapEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isFalseBoolean(varObjectEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isFalseBoolean(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isFalseBoolean(varSetEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isFalseBoolean(varWeakMapEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isFalseBoolean(varWeakSetEmpty)).is.false;
                expect(typecheck.isFalseBoolean(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isFalseBoolean(varFunction)).is.false;
                expect(typecheck.isFalseBoolean(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isFalseBoolean(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isFalseBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalseBoolean(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isFalseBoolean(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isFalseBoolean(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isFalseBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalseBoolean(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isFalseBoolean(trueString)).is.false;
                }
            });
        });
    });


    describe("isFalseNumber", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isFalseNumber(varBigInt)).is.false;
                expect(typecheck.isFalseNumber(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isFalseNumber(varBooleanFalse)).is.false;
                expect(typecheck.isFalseNumber(varBooleanObjectFalse)).is.false;
                expect(typecheck.isFalseNumber(varBooleanTrue)).is.false;
                expect(typecheck.isFalseNumber(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isFalseNumber(varNumber)).is.false;
                expect(typecheck.isFalseNumber(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isFalseNumber(varStringEmpty)).is.false;
                expect(typecheck.isFalseNumber(varString)).is.false;
                expect(typecheck.isFalseNumber(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isFalseNumber(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isFalseNumber(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isFalseNumber(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isFalseNumber(varEmptyArray)).is.false;
                expect(typecheck.isFalseNumber(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isFalseNumber(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isFalseNumber(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isFalseNumber(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isFalseNumber(varMapEmpty)).is.false;
                expect(typecheck.isFalseNumber(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isFalseNumber(varObjectEmpty)).is.false;
                expect(typecheck.isFalseNumber(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isFalseNumber(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isFalseNumber(varSetEmpty)).is.false;
                expect(typecheck.isFalseNumber(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isFalseNumber(varWeakMapEmpty)).is.false;
                expect(typecheck.isFalseNumber(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isFalseNumber(varWeakSetEmpty)).is.false;
                expect(typecheck.isFalseNumber(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isFalseNumber(varFunction)).is.false;
                expect(typecheck.isFalseNumber(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isFalseNumber(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isFalseNumber(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isFalseNumber(typecheck.getConfig().falseValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isFalseNumber(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isFalseNumber(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isFalseNumber(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalseNumber(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isFalseNumber(trueString)).is.false;
                }
            });
        });
    });


    describe("isFalseString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isFalseString(varBigInt)).is.false;
                expect(typecheck.isFalseString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isFalseString(varBooleanFalse)).is.false;
                expect(typecheck.isFalseString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isFalseString(varBooleanTrue)).is.false;
                expect(typecheck.isFalseString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isFalseString(varNumber)).is.false;
                expect(typecheck.isFalseString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isFalseString(varStringEmpty)).is.false;
                expect(typecheck.isFalseString(varString)).is.false;
                expect(typecheck.isFalseString(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isFalseString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isFalseString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isFalseString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isFalseString(varEmptyArray)).is.false;
                expect(typecheck.isFalseString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isFalseString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isFalseString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isFalseString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isFalseString(varMapEmpty)).is.false;
                expect(typecheck.isFalseString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isFalseString(varObjectEmpty)).is.false;
                expect(typecheck.isFalseString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isFalseString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isFalseString(varSetEmpty)).is.false;
                expect(typecheck.isFalseString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isFalseString(varWeakMapEmpty)).is.false;
                expect(typecheck.isFalseString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isFalseString(varWeakSetEmpty)).is.false;
                expect(typecheck.isFalseString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isFalseString(varFunction)).is.false;
                expect(typecheck.isFalseString(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isFalseString(falseChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isFalseString(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalseString(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isFalseString(falseString)).is.true;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isFalseString(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isFalseString(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isFalseString(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isFalseString(trueString)).is.false;
                }
            });
        });
    });


    describe("isFunction", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isFunction(varBigInt)).is.false;
                expect(typecheck.isFunction(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isFunction(varBooleanFalse)).is.false;
                expect(typecheck.isFunction(varBooleanObjectFalse)).is.false;
                expect(typecheck.isFunction(varBooleanTrue)).is.false;
                expect(typecheck.isFunction(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isFunction(varNumber)).is.false;
                expect(typecheck.isFunction(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isFunction(varStringEmpty)).is.false;
                expect(typecheck.isFunction(varString)).is.false;
                expect(typecheck.isFunction(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isFunction(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isFunction(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isFunction(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isFunction(varEmptyArray)).is.false;
                expect(typecheck.isFunction(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isFunction(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isFunction(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isFunction(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isFunction(varMapEmpty)).is.false;
                expect(typecheck.isFunction(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isFunction(varObjectEmpty)).is.false;
                expect(typecheck.isFunction(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isFunction(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isFunction(varSetEmpty)).is.false;
                expect(typecheck.isFunction(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isFunction(varWeakMapEmpty)).is.false;
                expect(typecheck.isFunction(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isFunction(varWeakSetEmpty)).is.false;
                expect(typecheck.isFunction(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isFunction(varFunction)).is.true;
                expect(typecheck.isFunction(varGeneratorFunction)).is.true;
            });
        });
    });


    describe("isFunction", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isGeneratorFunction(varBigInt)).is.false;
                expect(typecheck.isGeneratorFunction(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isGeneratorFunction(varBooleanFalse)).is.false;
                expect(typecheck.isGeneratorFunction(varBooleanObjectFalse)).is.false;
                expect(typecheck.isGeneratorFunction(varBooleanTrue)).is.false;
                expect(typecheck.isGeneratorFunction(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isGeneratorFunction(varNumber)).is.false;
                expect(typecheck.isGeneratorFunction(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isGeneratorFunction(varStringEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varString)).is.false;
                expect(typecheck.isGeneratorFunction(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isGeneratorFunction(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isGeneratorFunction(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isGeneratorFunction(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isGeneratorFunction(varEmptyArray)).is.false;
                expect(typecheck.isGeneratorFunction(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isGeneratorFunction(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isGeneratorFunction(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isGeneratorFunction(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isGeneratorFunction(varMapEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isGeneratorFunction(varObjectEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isGeneratorFunction(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isGeneratorFunction(varSetEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isGeneratorFunction(varWeakMapEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isGeneratorFunction(varWeakSetEmpty)).is.false;
                expect(typecheck.isGeneratorFunction(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isGeneratorFunction(varFunction)).is.false;
                expect(typecheck.isGeneratorFunction(varGeneratorFunction)).is.true;
            });
        });
    });


    describe("isGenerator", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isGenerator(varBigInt)).is.false;
                expect(typecheck.isGenerator(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isGenerator(varBooleanFalse)).is.false;
                expect(typecheck.isGenerator(varBooleanObjectFalse)).is.false;
                expect(typecheck.isGenerator(varBooleanTrue)).is.false;
                expect(typecheck.isGenerator(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isGenerator(varNumber)).is.false;
                expect(typecheck.isGenerator(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isGenerator(varStringEmpty)).is.false;
                expect(typecheck.isGenerator(varString)).is.false;
                expect(typecheck.isGenerator(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isGenerator(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isGenerator(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isGenerator(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isGenerator(varEmptyArray)).is.false;
                expect(typecheck.isGenerator(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isGenerator(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isGenerator(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isGenerator(varGenerator)).is.true;
            });

            it("Map", function () {
                expect(typecheck.isGenerator(varMapEmpty)).is.false;
                expect(typecheck.isGenerator(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isGenerator(varObjectEmpty)).is.false;
                expect(typecheck.isGenerator(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isGenerator(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isGenerator(varSetEmpty)).is.false;
                expect(typecheck.isGenerator(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isGenerator(varWeakMapEmpty)).is.false;
                expect(typecheck.isGenerator(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isGenerator(varWeakSetEmpty)).is.false;
                expect(typecheck.isGenerator(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isGenerator(varFunction)).is.false;
                expect(typecheck.isGenerator(varGeneratorFunction)).is.true;
            });
        });
    });


    describe("isJSONString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isJSONString(varBigInt)).is.false;
                expect(typecheck.isJSONString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isJSONString(varBooleanFalse)).is.false;
                expect(typecheck.isJSONString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isJSONString(varBooleanTrue)).is.false;
                expect(typecheck.isJSONString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isJSONString(varNumber)).is.false;
                expect(typecheck.isJSONString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isJSONString(varStringEmpty)).is.false;
                expect(typecheck.isJSONString(varString)).is.false;
                expect(typecheck.isJSONString(varStringObject)).is.false;
                expect(typecheck.isJSONString(varJSONSStringObjectEmpty)).is.true;
                expect(typecheck.isJSONString(varJSONSStringObject)).is.true;
                expect(typecheck.isJSONString(varJSONSStringArray)).is.true;
            });

            it("symbol", function () {
                expect(typecheck.isJSONString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isJSONString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isJSONString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isJSONString(varEmptyArray)).is.false;
                expect(typecheck.isJSONString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isJSONString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isJSONString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isJSONString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isJSONString(varMapEmpty)).is.false;
                expect(typecheck.isJSONString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isJSONString(varObjectEmpty)).is.false;
                expect(typecheck.isJSONString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isJSONString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isJSONString(varSetEmpty)).is.false;
                expect(typecheck.isJSONString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isJSONString(varWeakMapEmpty)).is.false;
                expect(typecheck.isJSONString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isJSONString(varWeakSetEmpty)).is.false;
                expect(typecheck.isJSONString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isJSONString(varFunction)).is.false;
                expect(typecheck.isJSONString(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isNotEmpty", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isNotEmpty(varBigInt)).is.true;
                expect(typecheck.isNotEmpty(varBigIntObject)).is.true;
            });

            it("boolean", function () {
                expect(typecheck.isNotEmpty(varBooleanFalse)).is.true;
                expect(typecheck.isNotEmpty(varBooleanObjectFalse)).is.true;
                expect(typecheck.isNotEmpty(varBooleanTrue)).is.true;
                expect(typecheck.isNotEmpty(varBooleanObjectTrue)).is.true;
            });

            it("number", function () {
                expect(typecheck.isNotEmpty(varNumber)).is.true;
                expect(typecheck.isNotEmpty(varNumberObject)).is.true;
            });

            it("string", function () {
                expect(typecheck.isNotEmpty(varStringEmpty)).is.false;
                expect(typecheck.isNotEmpty(varString)).is.true;
                expect(typecheck.isNotEmpty(varStringObject)).is.true;
            });

            it("symbol", function () {
                expect(typecheck.isNotEmpty(varSymbol)).is.true;
            });

            it("null", function () {
                expect(typecheck.isNotEmpty(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isNotEmpty(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isNotEmpty(varEmptyArray)).is.false;
                expect(typecheck.isNotEmpty(varArray)).is.true;
            });

            it("Date", function () {
                expect(typecheck.isNotEmpty(varDate)).is.true;
            });

            it("Error", function () {
                expect(typecheck.isNotEmpty(varError)).is.true;
            });

            it("Generator", function () {
                expect(typecheck.isNotEmpty(varGenerator)).is.true;
            });

            it("Map", function () {
                expect(typecheck.isNotEmpty(varMapEmpty)).is.false;
                expect(typecheck.isNotEmpty(varMap)).is.true;
            });

            it("Object", function () {
                expect(typecheck.isNotEmpty(varObjectEmpty)).is.false;
                expect(typecheck.isNotEmpty(varObject)).is.true;
            });

            it("RegExp", function () {
                expect(typecheck.isNotEmpty(varRegExp)).is.true;
            });

            it("Set", function () {
                expect(typecheck.isNotEmpty(varSetEmpty)).is.false;
                expect(typecheck.isNotEmpty(varSet)).is.true;
            });

            it("WeakMap", function () {
                expect(typecheck.isNotEmpty(varWeakMapEmpty)).is.false;
                expect(typecheck.isNotEmpty(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isNotEmpty(varWeakSetEmpty)).is.false;
                expect(typecheck.isNotEmpty(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isNotEmpty(varFunction)).is.true;
                expect(typecheck.isNotEmpty(varGeneratorFunction)).is.true;
            });
        });
    });


    describe("isNotEmptyString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isNotEmptyString(varBigInt)).is.false;
                expect(typecheck.isNotEmptyString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isNotEmptyString(varBooleanFalse)).is.false;
                expect(typecheck.isNotEmptyString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isNotEmptyString(varBooleanTrue)).is.false;
                expect(typecheck.isNotEmptyString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isNotEmptyString(varNumber)).is.false;
                expect(typecheck.isNotEmptyString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isNotEmptyString(varStringEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varString)).is.true;
                expect(typecheck.isNotEmptyString(varStringObject)).is.true;
            });

            it("symbol", function () {
                expect(typecheck.isNotEmptyString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isNotEmptyString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isNotEmptyString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isNotEmptyString(varEmptyArray)).is.false;
                expect(typecheck.isNotEmptyString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isNotEmptyString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isNotEmptyString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isNotEmptyString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isNotEmptyString(varMapEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isNotEmptyString(varObjectEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isNotEmptyString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isNotEmptyString(varSetEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isNotEmptyString(varWeakMapEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isNotEmptyString(varWeakSetEmpty)).is.false;
                expect(typecheck.isNotEmptyString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isNotEmptyString(varFunction)).is.false;
                expect(typecheck.isNotEmptyString(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isNull", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isNull(varBigInt)).is.false;
                expect(typecheck.isNull(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isNull(varBooleanFalse)).is.false;
                expect(typecheck.isNull(varBooleanObjectFalse)).is.false;
                expect(typecheck.isNull(varBooleanTrue)).is.false;
                expect(typecheck.isNull(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isNull(varNumber)).is.false;
                expect(typecheck.isNull(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isNull(varStringEmpty)).is.false;
                expect(typecheck.isNull(varString)).is.false;
                expect(typecheck.isNull(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isNull(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isNull(varNull)).is.true;
            });

            it("undefined", function () {
                expect(typecheck.isNull(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isNull(varEmptyArray)).is.false;
                expect(typecheck.isNull(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isNull(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isNull(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isNull(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isNull(varMapEmpty)).is.false;
                expect(typecheck.isNull(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isNull(varObjectEmpty)).is.false;
                expect(typecheck.isNull(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isNull(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isNull(varSetEmpty)).is.false;
                expect(typecheck.isNull(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isNull(varWeakMapEmpty)).is.false;
                expect(typecheck.isNull(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isNull(varWeakSetEmpty)).is.false;
                expect(typecheck.isNull(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isNull(varFunction)).is.false;
                expect(typecheck.isNull(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isNumeric", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isDate(varBigInt)).is.false;
                expect(typecheck.isNumeric(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isNumeric(varBooleanFalse)).is.false;
                expect(typecheck.isNumeric(varBooleanObjectFalse)).is.false;
                expect(typecheck.isNumeric(varBooleanTrue)).is.false;
                expect(typecheck.isNumeric(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isNumeric(varNumber)).is.true;
                expect(typecheck.isNumeric(varNumberObject)).is.true;
            });

            it("string", function () {
                expect(typecheck.isNumeric(varStringEmpty)).is.false;
                expect(typecheck.isNumeric(varString)).is.false;
                expect(typecheck.isNumeric(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isNumeric(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isNumeric(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isNumeric(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isNumeric(varEmptyArray)).is.false;
                expect(typecheck.isNumeric(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isNumeric(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isNumeric(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isNumeric(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isNumeric(varMapEmpty)).is.false;
                expect(typecheck.isNumeric(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isNumeric(varObjectEmpty)).is.false;
                expect(typecheck.isNumeric(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isNumeric(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isNumeric(varSetEmpty)).is.false;
                expect(typecheck.isNumeric(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isNumeric(varWeakMapEmpty)).is.false;
                expect(typecheck.isNumeric(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isNumeric(varWeakSetEmpty)).is.false;
                expect(typecheck.isNumeric(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isNumeric(varFunction)).is.false;
                expect(typecheck.isNumeric(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isObject", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isObject(varBigInt)).is.false;
                expect(typecheck.isObject(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isObject(varBooleanFalse)).is.false;
                expect(typecheck.isObject(varBooleanObjectFalse)).is.false;
                expect(typecheck.isObject(varBooleanTrue)).is.false;
                expect(typecheck.isObject(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isObject(varNumber)).is.false;
                expect(typecheck.isObject(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isObject(varStringEmpty)).is.false;
                expect(typecheck.isObject(varString)).is.false;
                expect(typecheck.isObject(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isObject(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isObject(varNull)).is.true;
            });

            it("undefined", function () {
                expect(typecheck.isObject(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isObject(varEmptyArray)).is.true;
                expect(typecheck.isObject(varArray)).is.true;
            });

            it("Date", function () {
                expect(typecheck.isObject(varDate)).is.true;
            });

            it("Error", function () {
                expect(typecheck.isObject(varError)).is.true;
            });

            it("Generator", function () {
                expect(typecheck.isObject(varGenerator)).is.true;
            });

            it("Map", function () {
                expect(typecheck.isObject(varMapEmpty)).is.true;
                expect(typecheck.isObject(varMap)).is.true;
            });

            it("Object", function () {
                expect(typecheck.isObject(varObjectEmpty)).is.true;
                expect(typecheck.isObject(varObject)).is.true;
            });

            it("RegExp", function () {
                expect(typecheck.isObject(varRegExp)).is.true;
            });

            it("Set", function () {
                expect(typecheck.isObject(varSetEmpty)).is.true;
                expect(typecheck.isObject(varSet)).is.true;
            });

            it("WeakMap", function () {
                expect(typecheck.isObject(varWeakMapEmpty)).is.true;
                expect(typecheck.isObject(varWeakMap)).is.true;
            });

            it("WeakSet", function () {
                expect(typecheck.isObject(varWeakSetEmpty)).is.true;
                expect(typecheck.isObject(varWeakSet)).is.true;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isObject(varFunction)).is.false;
                expect(typecheck.isObject(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isString(varBigInt)).is.false;
                expect(typecheck.isString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isString(varBooleanFalse)).is.false;
                expect(typecheck.isString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isString(varBooleanTrue)).is.false;
                expect(typecheck.isString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isString(varNumber)).is.false;
                expect(typecheck.isString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isString(varStringEmpty)).is.true;
                expect(typecheck.isString(varString)).is.true;
                expect(typecheck.isString(varStringObject)).is.true;
            });

            it("symbol", function () {
                expect(typecheck.isString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isString(varEmptyArray)).is.false;
                expect(typecheck.isString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isString(varMapEmpty)).is.false;
                expect(typecheck.isString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isString(varObjectEmpty)).is.false;
                expect(typecheck.isString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isString(varSetEmpty)).is.false;
                expect(typecheck.isString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isString(varWeakMapEmpty)).is.false;
                expect(typecheck.isString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isString(varWeakSetEmpty)).is.false;
                expect(typecheck.isString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isString(varFunction)).is.false;
                expect(typecheck.isString(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isSymbol", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isSymbol(varBigInt)).is.false;
                expect(typecheck.isSymbol(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isSymbol(varBooleanFalse)).is.false;
                expect(typecheck.isSymbol(varBooleanObjectFalse)).is.false;
                expect(typecheck.isSymbol(varBooleanTrue)).is.false;
                expect(typecheck.isSymbol(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isSymbol(varNumber)).is.false;
                expect(typecheck.isSymbol(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isSymbol(varStringEmpty)).is.false;
                expect(typecheck.isSymbol(varString)).is.false;
                expect(typecheck.isSymbol(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isSymbol(varSymbol)).is.true;
            });

            it("null", function () {
                expect(typecheck.isSymbol(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isSymbol(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isSymbol(varEmptyArray)).is.false;
                expect(typecheck.isSymbol(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isSymbol(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isSymbol(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isSymbol(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isSymbol(varMapEmpty)).is.false;
                expect(typecheck.isSymbol(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isSymbol(varObjectEmpty)).is.false;
                expect(typecheck.isSymbol(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isSymbol(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isSymbol(varSetEmpty)).is.false;
                expect(typecheck.isSymbol(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isSymbol(varWeakMapEmpty)).is.false;
                expect(typecheck.isSymbol(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isSymbol(varWeakSetEmpty)).is.false;
                expect(typecheck.isSymbol(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isSymbol(varFunction)).is.false;
                expect(typecheck.isSymbol(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isTrue", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isTrue(varBigInt)).is.false;
                expect(typecheck.isTrue(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isTrue(varBooleanFalse)).is.false;
                expect(typecheck.isTrue(varBooleanObjectFalse)).is.false;
                expect(typecheck.isTrue(varBooleanTrue)).is.true;
                expect(typecheck.isTrue(varBooleanObjectTrue)).is.true;
            });

            it("number", function () {
                expect(typecheck.isTrue(varNumber)).is.false;
                expect(typecheck.isTrue(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isTrue(varStringEmpty)).is.false;
                expect(typecheck.isTrue(varString)).is.false;
                expect(typecheck.isTrue(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isTrue(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isTrue(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isTrue(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isTrue(varEmptyArray)).is.false;
                expect(typecheck.isTrue(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isTrue(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isTrue(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isTrue(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isTrue(varMapEmpty)).is.false;
                expect(typecheck.isTrue(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isTrue(varObjectEmpty)).is.false;
                expect(typecheck.isTrue(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isTrue(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isTrue(varSetEmpty)).is.false;
                expect(typecheck.isTrue(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isTrue(varWeakMapEmpty)).is.false;
                expect(typecheck.isTrue(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isTrue(varWeakSetEmpty)).is.false;
                expect(typecheck.isTrue(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isTrue(varFunction)).is.false;
                expect(typecheck.isTrue(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isTrue(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isTrue(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrue(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isTrue(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isTrue(trueChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isTrue(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isTrue(typecheck.getConfig().trueValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isTrue(trueString)).is.true;
                }
            });
        });
    });


    describe("isTrueBoolean", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isTrueBoolean(varBigInt)).is.false;
                expect(typecheck.isTrueBoolean(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isTrueBoolean(varBooleanFalse)).is.false;
                expect(typecheck.isTrueBoolean(varBooleanObjectFalse)).is.false;
                expect(typecheck.isTrueBoolean(varBooleanTrue)).is.true;
                expect(typecheck.isTrueBoolean(varBooleanObjectTrue)).is.true;
            });

            it("number", function () {
                expect(typecheck.isTrueBoolean(varNumber)).is.false;
                expect(typecheck.isTrueBoolean(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isTrueBoolean(varStringEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varString)).is.false;
                expect(typecheck.isTrueBoolean(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isTrueBoolean(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isTrueBoolean(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isTrueBoolean(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isTrueBoolean(varEmptyArray)).is.false;
                expect(typecheck.isTrueBoolean(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isTrueBoolean(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isTrueBoolean(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isTrueBoolean(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isTrueBoolean(varMapEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isTrueBoolean(varObjectEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isTrueBoolean(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isTrueBoolean(varSetEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isTrueBoolean(varWeakMapEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isTrueBoolean(varWeakSetEmpty)).is.false;
                expect(typecheck.isTrueBoolean(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isTrueBoolean(varFunction)).is.false;
                expect(typecheck.isTrueBoolean(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isTrueBoolean(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isTrueBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrueBoolean(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isTrueBoolean(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isTrueBoolean(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isTrueBoolean(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrueBoolean(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isTrueBoolean(trueString)).is.false;
                }
            });
        });
    });


    describe("isTrueNumber", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isTrueNumber(varBigInt)).is.false;
                expect(typecheck.isTrueNumber(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isTrueNumber(varBooleanFalse)).is.false;
                expect(typecheck.isTrueNumber(varBooleanObjectFalse)).is.false;
                expect(typecheck.isTrueNumber(varBooleanTrue)).is.false;
                expect(typecheck.isTrueNumber(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isTrueNumber(varNumber)).is.false;
                expect(typecheck.isTrueNumber(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isTrueNumber(varStringEmpty)).is.false;
                expect(typecheck.isTrueNumber(varString)).is.false;
                expect(typecheck.isTrueNumber(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isTrueNumber(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isTrueNumber(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isTrueNumber(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isTrueNumber(varEmptyArray)).is.false;
                expect(typecheck.isTrueNumber(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isTrueNumber(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isTrueNumber(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isTrueNumber(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isTrueNumber(varMapEmpty)).is.false;
                expect(typecheck.isTrueNumber(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isTrueNumber(varObjectEmpty)).is.false;
                expect(typecheck.isTrueNumber(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isTrueNumber(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isTrueNumber(varSetEmpty)).is.false;
                expect(typecheck.isTrueNumber(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isTrueNumber(varWeakMapEmpty)).is.false;
                expect(typecheck.isTrueNumber(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isTrueNumber(varWeakSetEmpty)).is.false;
                expect(typecheck.isTrueNumber(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isTrueNumber(varFunction)).is.false;
                expect(typecheck.isTrueNumber(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isTrueNumber(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isTrueNumber(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrueNumber(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isTrueNumber(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isTrueNumber(trueChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isTrueNumber(falseNumber)).is.true;
                    }
                }
                else {
                    expect(typecheck.isTrueNumber(typecheck.getConfig().trueValues.numeric)).is.true;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isTrueNumber(trueString)).is.false;
                }
            });
        });
    });


    describe("isTrueString", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isTrueString(varBigInt)).is.false;
                expect(typecheck.isTrueString(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isTrueString(varBooleanFalse)).is.false;
                expect(typecheck.isTrueString(varBooleanObjectFalse)).is.false;
                expect(typecheck.isTrueString(varBooleanTrue)).is.false;
                expect(typecheck.isTrueString(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isTrueString(varNumber)).is.false;
                expect(typecheck.isTrueString(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isTrueString(varStringEmpty)).is.false;
                expect(typecheck.isTrueString(varString)).is.false;
                expect(typecheck.isTrueString(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isTrueString(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isTrueString(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isTrueString(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isTrueString(varEmptyArray)).is.false;
                expect(typecheck.isTrueString(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isTrueString(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isTrueString(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isTrueString(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isTrueString(varMapEmpty)).is.false;
                expect(typecheck.isTrueString(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isTrueString(varObjectEmpty)).is.false;
                expect(typecheck.isTrueString(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isTrueString(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isTrueString(varSetEmpty)).is.false;
                expect(typecheck.isTrueString(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isTrueString(varWeakMapEmpty)).is.false;
                expect(typecheck.isTrueString(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isTrueString(varWeakSetEmpty)).is.false;
                expect(typecheck.isTrueString(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isTrueString(varFunction)).is.false;
                expect(typecheck.isTrueString(varGeneratorFunction)).is.false;
            });
        });

        describe("check false value objects", function() {
            it("characters", function () {
                for ( let falseChar of typecheck.getConfig().falseValues.character ) {
                    expect(typecheck.isTrueString(falseChar)).is.false;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().falseValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().falseValues.numeric ) {
                        expect(typecheck.isTrueString(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrueString(typecheck.getConfig().falseValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let falseString of typecheck.getConfig().falseValues.string ) {
                    expect(typecheck.isTrueString(falseString)).is.false;
                }
            });
        });

        describe("check true value objects", function() {
            it("characters", function () {
                for ( let trueChar of typecheck.getConfig().trueValues.character ) {
                    expect(typecheck.isTrueString(trueChar)).is.true;
                }
            });

            it("numbers", function () {
                if (typecheck.isArray(typecheck.getConfig().trueValues.numeric)) {
                    for ( let falseNumber of typecheck.getConfig().trueValues.numeric ) {
                        expect(typecheck.isTrueString(falseNumber)).is.false;
                    }
                }
                else {
                    expect(typecheck.isTrueString(typecheck.getConfig().trueValues.numeric)).is.false;
                }
            });

            it("string", function () {
                for ( let trueString of typecheck.getConfig().trueValues.string ) {
                    expect(typecheck.isTrueString(trueString)).is.true;
                }
            });
        });
    });


    describe("isUndefined", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isUndefined(varBigInt)).is.false;
                expect(typecheck.isUndefined(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isUndefined(varBooleanFalse)).is.false;
                expect(typecheck.isUndefined(varBooleanObjectFalse)).is.false;
                expect(typecheck.isUndefined(varBooleanTrue)).is.false;
                expect(typecheck.isUndefined(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isUndefined(varNumber)).is.false;
                expect(typecheck.isUndefined(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isUndefined(varStringEmpty)).is.false;
                expect(typecheck.isUndefined(varString)).is.false;
                expect(typecheck.isUndefined(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isUndefined(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isUndefined(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isUndefined(varUndefined)).is.true;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isUndefined(varEmptyArray)).is.false;
                expect(typecheck.isUndefined(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isUndefined(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isUndefined(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isUndefined(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isUndefined(varMapEmpty)).is.false;
                expect(typecheck.isUndefined(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isUndefined(varObjectEmpty)).is.false;
                expect(typecheck.isUndefined(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isUndefined(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isUndefined(varSetEmpty)).is.false;
                expect(typecheck.isUndefined(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isUndefined(varWeakMapEmpty)).is.false;
                expect(typecheck.isUndefined(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isUndefined(varWeakSetEmpty)).is.false;
                expect(typecheck.isUndefined(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isUndefined(varFunction)).is.false;
                expect(typecheck.isUndefined(varGeneratorFunction)).is.false;
            });
        });
    });


    describe("isUnknown", function() {
        describe("checks primitive types", function() {
            it("bigint", function () {
                expect(typecheck.isUnknown(varBigInt)).is.false;
                expect(typecheck.isUnknown(varBigIntObject)).is.false;
            });

            it("boolean", function () {
                expect(typecheck.isUnknown(varBooleanFalse)).is.false;
                expect(typecheck.isUnknown(varBooleanObjectFalse)).is.false;
                expect(typecheck.isUnknown(varBooleanTrue)).is.false;
                expect(typecheck.isUnknown(varBooleanObjectTrue)).is.false;
            });

            it("number", function () {
                expect(typecheck.isDate(varNumber)).is.false;
                expect(typecheck.isUnknown(varNumberObject)).is.false;
            });

            it("string", function () {
                expect(typecheck.isUnknown(varStringEmpty)).is.false;
                expect(typecheck.isUnknown(varString)).is.false;
                expect(typecheck.isUnknown(varStringObject)).is.false;
            });

            it("symbol", function () {
                expect(typecheck.isUnknown(varSymbol)).is.false;
            });

            it("null", function () {
                expect(typecheck.isUnknown(varNull)).is.false;
            });

            it("undefined", function () {
                expect(typecheck.isUnknown(varUndefined)).is.false;
            });
        });

        describe("checks object type/instances", function() {
            it("Array", function () {
                expect(typecheck.isUnknown(varEmptyArray)).is.false;
                expect(typecheck.isUnknown(varArray)).is.false;
            });

            it("Date", function () {
                expect(typecheck.isUnknown(varDate)).is.false;
            });

            it("Error", function () {
                expect(typecheck.isUnknown(varError)).is.false;
            });

            it("Generator", function () {
                expect(typecheck.isUnknown(varGenerator)).is.false;
            });

            it("Map", function () {
                expect(typecheck.isUnknown(varMapEmpty)).is.false;
                expect(typecheck.isUnknown(varMap)).is.false;
            });

            it("Object", function () {
                expect(typecheck.isUnknown(varObjectEmpty)).is.false;
                expect(typecheck.isUnknown(varObject)).is.false;
            });

            it("RegExp", function () {
                expect(typecheck.isUnknown(varRegExp)).is.false;
            });

            it("Set", function () {
                expect(typecheck.isUnknown(varSetEmpty)).is.false;
                expect(typecheck.isUnknown(varSet)).is.false;
            });

            it("WeakMap", function () {
                expect(typecheck.isUnknown(varWeakMapEmpty)).is.false;
                expect(typecheck.isUnknown(varWeakMap)).is.false;
            });

            it("WeakSet", function () {
                expect(typecheck.isUnknown(varWeakSetEmpty)).is.false;
                expect(typecheck.isUnknown(varWeakSet)).is.false;
            });
        });

        describe("checks additional types", function() {
            it("function", function () {
                expect(typecheck.isUnknown(varFunction)).is.false;
                expect(typecheck.isUnknown(varGeneratorFunction)).is.false;
            });
        });
    });

});
