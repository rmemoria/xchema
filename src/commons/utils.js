
/**
 * Set of utility functions used throughout the application
 */


/**
 * Return a property value from an object. The property name supports nested properties
 * (p1.p2.p3, for example) and indexed property as well (p[1] for example)
 * @param  {[type]} obj  [description]
 * @param  {[type]} prop [description]
 * @return {[type]}      [description]
 */
module.exports.getValue = function(obj, prop) {
    let value = obj;
    let s = prop.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in value) {
            value = value[k];
            if (!value) {
                return value;
            }
        } else {
            return undefined;
        }
    }
    return value;
};

/**
 * Set a value of an object by giving its property. The property argument may reference a
 * nested property, separated by dots or brackets. Ex.: val[1].prop
 * @param {[type]} obj        The object to set the value in
 * @param {[type]} prop       The name of the property
 * @param {[type]} val        The value to set in the given property
 * @param {[type]} autoCreate If true and one of the nested properties doesn't exist, an empty object will be set.
 *                            If false and one of the nested properties doesn't exist an exception will be thrown
 */
module.exports.setValue = function(obj, prop, val, autoCreate) {
    let value = obj;
    let s = prop.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var props = s.split('.');

    for (var i = 0; i < props.length - 1; i++) {
        const k = props[i];
        let newval = value[k];

        // new value was found ?
        if (!newval) {
            // object is to be created automatically ?
            if (autoCreate) {
                newval = {};
                value[k] = newval;
            } else {
                // if value is not found, raises an exception
                throw new Error('Cannot set property ' + prop);
            }
        }
        value = newval;
    }

    // set the value
    const p = props[props.length - 1];
    value[p] = val;
};

/**
 * Check if value is null or undefined
 * @param  {[type]}  val [description]
 * @return {Boolean}     [description]
 */
var isEmpty = module.exports.isEmpty = function(val) {
    return val === undefined || val === null;
};

/**
 * Compare if two objects have the same properties and values. property values are compared
 * using === operator, i.e, a shallow comparation is done
 * @param  {object} obj1 The first object
 * @param  {bbject} obj2 The second object
 * @return {boolean}     True if both object are the same
 */
var objEqual = module.exports.objEqual = function(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    const empty1 = isEmpty(obj1);
    const empty2 = isEmpty(obj2);
    // check if objects exist
    if (empty1 && empty2) {
        return true;
    }

    if (empty1 || empty2) {
        return false;
    }

    // if just one is empty, so they are different
    if (empty1 || empty2) {
        return false;
    }

    return propertiesEqual(obj1, obj2);
};

var propertiesEqual = module.exports.propertiesEqual = function(obj1, obj2) {
    // check if number of properties are the same
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    // finally check the object properties
    for (var k in obj1) {
        const val1 = obj1[k];
        const val2 = obj2[k];
        if (val1 !== val2) {
            const isObject = val1 ? val1.constructor.name === 'Object' : false;
            // property is an object ? if so, check if they are really different
            if (isObject && !objEqual(val1, val2) || !isObject) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Check if a value is an object
 * @param {any} val a value to be tested
 */
module.exports.isObject = function(val) {
    return typeof val === 'object' && !Array.isArray(val);
};

/**
 * Check if a value is an array
 * @param {any} val the value to be tested
 */
module.exports.isArray = function(val) {
    return Array.isArray(val);
};

/**
 * Return true if object is a promise
 * @param  {object}  obj The object to be tested
 * @return {Boolean}     [description]
 */
module.exports.isPromise = function(obj) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

/**
 * Test if object is a function
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
module.exports.isFunction = function(obj) {
    return !!obj && typeof obj === 'function';
};

/**
 * Check if an object is a string
 * @param  {[type]}  obj [description]
 * @return {Boolean}     true if value is a string, otherwise return false
 */
module.exports.isString = obj => typeof obj === 'string';

/**
 * Check if a value is a number
 * @param {any} value value to be tested if is a number
 */
module.exports.isNumber = value => typeof value === 'number';

module.exports.isBoolean = value => typeof value === 'boolean';

module.exports.isDate = value => value instanceof Date;
