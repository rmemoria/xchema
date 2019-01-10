const assert = require('assert');
const Schema = require('../src');
const Types = Schema.types;

describe('Options in properties', () => {

    it('String options', () => {
        const sc = Schema.create({
            city: Types.string()
                .options([
                    'Vancouver',
                    'New York',
                    'Rio de Janeiro'
                ])
        });

        return sc.validate({ city: 'Vancouver' })
            .then(doc => {
                assert(doc);
                assert(doc.city);

                return sc.validate({ city: 'Montreal' });
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'city');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });

    it('String options (function)', () => {
        const sc = Schema.create({
            country: Types.string()
                .notNull()
                .options(['Canada', 'Brazil']),
            city: Types.string()
                .notNull()
                .options((val, doc) => {
                    if (doc.country === 'Canada') {
                        return ['Vancouver', 'Montreal', 'Calgary'];
                    } else {
                        return ['Rio de Janeiro', 'Salvador', 'São Paulo'];
                    }
                })
        });

        return sc.validate({ country: 'Canada', city: 'Vancouver' })
            .then(doc => {
                assert(doc);

                return sc.validate({ country: 'Brazil', city: 'Montreal' });
            })
            .then(() => {
                throw new Error('Should not be called');
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'city');
                assert.equal(err.code, 'INVALID_VALUE');
            })
            .then(() => {
                return sc.validate({ country: 'Brazil', city: 'Salvador' });
            })
            .then(doc => {
                assert(doc);
            });
    });

    it('Number options', () => {
        const sc = Schema.create({
            value: Types.number()
                .notNull()
                .options([1, 3, 5, 7, 9])
        });

        // valid value
        return sc.validate({ value: 5 })
            .then(doc => {
                assert(doc);

                // invalid value
                return sc.validate({ value: 6 });
            })
            .then(() => {
                throw new Error('Should not be resolved');
            })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.constructor.name, 'ValidationErrors');
                assert.equal(errs.errors.length, 1);
                const err = errs.errors[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });
});