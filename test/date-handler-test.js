const assert = require('assert');
const Schema = require('../src'), Types = Schema.types;


describe('Date validator', function() {

    it('Valid type', function() {
        const sc = Schema.create({
            value: Types.date()
        });

        const dt = new Date();

        return sc.validate({ value: dt })
            .then(doc => {
                assert(doc);
                assert.equal(dt, doc.value);

                return sc.validate({ value: '2018-01-01T00:00:00'});
            })
            .then(doc => {
                assert(doc);
                assert(doc.value);
                assert(doc.value instanceof Date);

                return sc.validate({ value: dt.getTime() });
            })
            .then(doc => {
                assert(doc);
                assert(doc.value);
                assert.equal(doc.value.getTime(), dt.getTime());
            });
    });

    it('Invalid type', () => {
        const sc = Schema.create({
            value: {
                type: 'date'
            }
        });

        return sc.validate({ value: 'aa-bb-cc' })
            .catch(errs => {
                assert(errs);
                assert.equal(errs.length, 1);
                const err = errs[0];
                assert.equal(err.property, 'value');
                assert.equal(err.code, 'INVALID_VALUE');
            });
    });

    it('Custom converter', () => {
        Schema.registerConverter('myDateFormat', val => {
            const vals = val.split('.').map(v => parseInt(v));
            return new Date(vals[2], vals[1], vals[0]);
        });

        const sc = Schema.create({
            value: Types.date().convertBefore('myDateFormat')
        });

        return sc.validate({ value: '13.11.1971' })
            .then(doc => {
                assert(doc);
                assert(doc.value);
                assert.equal(doc.value.getTime(), new Date(1971, 11, 13).getTime());
            });
    });
});
