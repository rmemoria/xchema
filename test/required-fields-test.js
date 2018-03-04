const assert = require('assert');
const validator = require('../src');
const utils = require('../src/commons/utils');

const schema = {
    properties: {
        name1: {
            type: 'string'
        },
        name2: {
            type: 'string',
            required: (v, doc) => utils.isEmpty(doc.name1)
        }
    }
};

describe('Required fields', () => {

    it('Conditional requirement', () => {
        return validator.validate({ name1: 'Test' }, schema)
            .then(doc => {
                assert(doc);
                assert(doc.name1);
            });
    });
});