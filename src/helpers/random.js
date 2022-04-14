var typechecks = require('../../gulp/functions/type-checks');

/**
 * random
 * @param minValue . inclusive
 * @param maxValue - exclusive
 * <p>TODO
 */
module.exports = function(minValue, maxValue) {
    let METHOD = "random(minValue, maxValue)";
    let min = minValue || 0;
    let max = maxValue || 10;

    if ( !typechecks.isNumeric(min) ) {
        throw `${METHOD} [ERROR] non numeric minValue :${min}`;
    }
    if ( !typechecks.isNumeric(max) ) {
        throw `${METHOD} [ERROR] non numeric maxValue :${max}`;
    }

    return Math.floor(Math.random() * (max - min) ) + min;
};