const assert = require('assert');
const Schema = require('../src'), Types = Schema.types;


describe('Date validator', () => {

    it('Valid type', async () => {
        const sc = Schema.create({
            value: Types.date()
        });

        const dt = new Date();

        var doc = await sc.validate({ value: dt });
        assert(doc);
        assert.equal(dt, doc.value);

        doc = await sc.validate({ value: '2018-01-01T00:00:00'});
        assert(doc);
        assert(doc.value);
        assert(doc.value instanceof Date);

        doc = await sc.validate({ value: dt.getTime() });
        assert(doc);
        assert(doc.value);
        assert.equal(doc.value.getTime(), dt.getTime());
    });

    it('Invalid type', async () => {
        const sc = Schema.create({
            value: {
                type: 'date'
            }
        });

        try {
            await sc.validate({ value: 'aa-bb-cc' });
        } catch (errs) {
            assert(errs);
            assert.equal(errs.constructor.name, 'ValidationErrors');
            assert.equal(errs.errors.length, 1);
            const err = errs.errors[0];
            assert.equal(err.property, 'value');
            assert.equal(err.code, 'INVALID_VALUE');
        }
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
