# object-validator
An extensible object validator and converter for NodeJS. Main features are:

* Asyncronous - Promise based;
* Extensible - You can register new types and its code to handle them;
* Custom validators - Validators can be implemented in property and object level. Possibility to register a custom validator that is commonly used;
* Custom converter - Properties can be converted to a new valid by custom converters;
* Schema builder - You can declare schema as plain objects or using a schema builder to make it easier;

## Usage

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
