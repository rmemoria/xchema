# Schema
An extensible object validator and converter for NodeJS. Main features are:

* Asyncronous - Promise based;
* Extensible - You can register new types and its code to handle them;
* Custom validators - Validators can be implemented in property and object level. Possibility to register a custom validator that is commonly used;
* Custom converter - Properties can be converted to a new valid by custom converters;
* Schema builder - You can declare schema as plain objects or using a schema builder to make it easier;

## Basic validation

 ```javascript
 // required library
 const Schema = require('xchema');
 // shortcut for easier schema declaration
 const Types = Schema.types;

 // create a schema to validate an object
 // with 2 properties - name and age
 const sc = Schema.create({
    name: Types.string()
        .notNull()
        .min(3)
        .max(50),
    age: Types.number()
        .min(18)
        .max(120);
 });

 // validate an object
 sc.validate({ name: 'Ricardo', age: 22 })
    // it is promise based
    .then(doc => {
        // a new validated object is returned
        assert(doc);
        assert.equal(doc.name, 'Ricardo');
        assert.equal(doc.age, 22);
    })
    .catch(err => {
        // catch any validation error
        ...
    });
 ```

In this example the schema was created using property builders. If you prefer, you can use a more declarative way:

```javascript
const sc = Schema.create({
    name: {
        type: 'string',
        notNull: true,
        min: 3,
        max: 50
    },
    age: {
        type: 'number',
        min: 18,
        max: 120
    }
});
```

It is more verbose, but ideal if you want to, for example, store your schema.

## Async/await

Since `schema` returns a promise, it is totally compatible with async/await instructions:

```javascript
async function doSomething(data) {
    ...
    try {
        const validatedData = await schema.validate(data);
    } catch(err) {
        // error handler here
    }
    ...
}
```

## Property types

Out of the box, these are the supported types:

* string
* number
* bool
* date
* dateTime
* time
* object
* array

They are available as property builders in `Schema.types` or, if declaring schemas in pure object mode, as the value of the `type` property. Example, both declarations are the same:

```javascript
name: Types.date()
```

or

```javascript
name: {
    type: 'date'
}
```

New types and property builders can be declared (see below).

## Standard Property Builders

The library comes with a set of supported types and its property builders in `Schema.Types` property:

### All types

These properties are common to all types:
* `.notNull(value)` - Indicate if property is required or not. Value can be a boolean value or a function that will return a boolean value. The function will be resolved during property validation;
* `.label(value)` - A description of the property that can be used in schema report generation, UI, etc. Doesn't play any role during validation;
* `.validIf(func)` - Specify a function that will check if property value is valid;
* `.defaultValue(val)` - Specify a default value, in case the property is not informed or contain a null value. Value can be any value, including a function;
* `.convertBefore(func)` - Specify a function (or the name of a global converter) that will return a new value for the property value. This function is called before validation is done;
* `.convertAfter(func)` - Specify a function (or the name of a global converter) that will return a new value for the property. This function is called after validation is done;
* `options(value)` - Define the possible values for a property. Value may be an array or a function;

### string()
* `.max(value)` - Set the maximum length of a string. Value can be a positive number or a function that returns a number;
* `.min(value)` - Set the minimum length of a string. Value can be a positive number or a function that returns a number;
* `.trim()` - Remove any extra space around the string;
* `.toUpperCase()` - Convert the string value to upper case;
* `.toLowerCase()` - Convert the string value to lower case;
* `.match(pattern)` - Check if string matches the pattern;
* `.endsWith(str)` - Check if string ends the given str value;
* `.startsWith(str)` - Check if string starts the given str value;

### number()

* `.max(value)` - Set the maximum value for a number. It can be a number or a function;
* `.min(value)` - Set the minimum value for a number. It can be a number or a function;

### bool()

No extra builder available, just the ones available for all types.

### date()

The date type accepts dates in the ISO format, `Date` objects or numbers.

* `futureOnly()` - Only allow future dates;
* `pastOnly()` - Only allow past dates;
* `min(value)` - Set the minimum date allowed. Value can be a date or a function;
* `max(value)` - Set the maximum date allowed. Value can be a date or a function;
* `removeTime()` - Remove the time component of the `Date` object, leaving just the date part. Actually the time part is set to 00:00:00;


### object(schema)

Validate properties that are simple objects. The `schema` argument is the same schema definition used in `Schema.create` function.

* `allowExtraProperties()` - Specify that properties not defined in the schema are accepted and not modified;
* `removeExtraProperties()` - Accept extra properties but remove them from the object;
* `invalidExtraProperties()` - Default. Properties not defined in schema will generate a validation error;

### array()

* `of(value)` - Set the array type as any of the types available in `Schema.Types`.
* `max(value)` - Set the maximum number of elements in the array;
* `min(value)` - Set the mininum number of elements in the array;

## Global Schema object

New schema validators can be created with the global `Schema` object. For example:

Create a new schema
```javascript
const Schema = require('xchema');

const mySchema = Schema.create({ login: Types.string().notNull() });
```

This object can also be used to register new types, global validators and global converters (described below).

## Validating objects

The function `Schema.create` creates a new instance of `ObjectSchema` class. This class contains a unique `validate` method that receives an object and returns a promise. Following the schema above:

```javascript
schema.validate(obj)
    .then(doc => {
        // called if is a valid object
    })
    .catch(errs => {
        // called if any validation error was found
    })
```

Or using await/async in ES6
```javascript
async function anyFunction() {
    ...
    return await schema.validate(obj)
}
```

### Valid objects

The promise returned by `ObjectSchema.validate()` will resolve if there is no validation error. In this case, a copy of the object is passed as a return of the promise.

```javascript
myschema.validate(obj)
    .then(doc => {
        // doc is a copy of obj
    })
```

The reason promise returns a copy (and not the original object) is because the later can be modifed by custom converters (see below for more details). Custom converters can modify the value of the property being validated.

### Validation errors

In case there is a validation error, the promise will be rejected, returning a `ValidationErrors` object with an `errors` property containing an array of error validation objects.

The standard way to handle errors is:

```javascript
mySchema.validate(obj)
    .then(...)
    .catch(error => {
        // here you handle validation errors
        console.log('Found ' + error.errors.length);
        error.errors.forEach(err => {
            console.log(err.property + ': (' err.code + ') ' + err.message);
        })
    });
```
errors is a list of object in the following format:

```javascript
[
    {
        property: ..., // name of the property
        message: ..., // displayable error message
        code: ..., // error code
    }
]
```

The `code` property is a way of expose a fixed and standard code for programatically identification of the error. You can specify your own error code, but there are some commonly used in case of errors:

* `NOT_NULL` - Property value not informed;
* `INVALID_PROPERTY` - Property is not part of the schema;
* `MAX_VALUE` - Property value is over the maximum allowed value (used in number type);
* `MIN_VALUE` - Property value is under the minimum allowed value (number type);
* `MAX_SIZE` - Property value is over the maximum lenght (strings and arrays);
* `MIN_SIZE` - Property value is under the minimum length (strings and arrays);
* `INVALID_VALUE` - Property value is not a valid value;

## Custom validator

You can declare custom validators at property and object level. They are functions that will check if the property or object value return true for valid values, or false for invalid values.

This schema test if there is any whitespace in the login:

```javascript
const sc = Schema.create({
    login: Type.string()
        .validIf(val => val.indexOf(' ') === -1)
});
```

In the example below, the validation will fail and will return a promise that will be rejected:


```javascript
sc.validate({ login: 'Invalid login' })
    .then(doc => {
        // code to run if valid
    })
    .catch(errs => {
        // errs is an object containing an array with validation error objects
        // errors: [ { property: 'login', message: null, code: 'INVALID_VALUE' }]
    });
```

You can specify custom messages and codes to be used in vadation errors:

```javascript
const sc = Schema.create({
    login: Type.string()
        .validIf(val => val.indexOf(' ') === -1)
        .withErrorMessage('Cannot contain whitespaces')
        .withErrorCode('INVALID_LOGIN')
});
```

If your validation requires asynchronous calls, just return a promise.

```javascript
    .validIf(val => new Promise((resolve, reject) => {
        // execute asynchronous calls
    }));
```

### Global custom validators

TO BE DONE

## Converters

TO BE DONE

### Global converters

TO BE DONE

## Implementing new property types

TO BE DONE

### Property builders

TO BE DONE
