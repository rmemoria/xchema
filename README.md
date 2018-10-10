# object-validator
An extensible object validator and converter for NodeJS. Main features are:

* Asyncronous - Promise based;
* Extensible - You can register new types and its code to handle them;
* Custom validators - Validators can be implemented in property and object level. Possibility to register a custom validator that is commonly used;
* Custom converter - Properties can be converted to a new valid by custom converters;
* Schema builder - You can declare schema as plain objects or using a schema builder to make it easier;

## Basic validation

 ```javascript
 // required library
 const Schema = require('object-validator');
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
    .catch(errs => {
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

and

```javascript
name: {
    type: 'date'
}
```

New types and property builders can be declared (see below).

## Global Schema object

New schema validators can be created with the global `Schema` object. For example:

Create a new schema
```javascript
const Schema = require('obj-validator');

Schema.create({ login: Types.string().notNull() });
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

In case there is a validation error, the promise will be rejected, returning an array of error validation objects.

The standard way to handle errors is:

```javascript
mySchema.validate(obj)
    .then(...)
    .catch(errors => {
        // here you handle validation errors
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

You can declare custom validators in property and object level. These validators are functions that will validate the property or object value.

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
        // errs is an array with validation error objects
        // [ { property: 'login', message: null, code: 'INVALID' }]
    });
```

