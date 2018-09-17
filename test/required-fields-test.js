const assert = require('assert');
const Schema = require('../src');
const Types = Schema.types;
const utils = require('../src/commons/utils');

const schema = Schema.create({
    name1: Types.string(),
    name2: Types.string()
        .notNull((v, doc) => utils.isEmpty(doc.name1))
});
// const schema = {
//     properties: {
//         name1: {
//             type: 'string'
//         },
//         name2: {
//             type: 'string',
//             required: (v, doc) => utils.isEmpty(doc.name1)
//         }
//     }
// };

describe('Required fields', () => {

    it('Conditional requirement', () => {
        return schema.validate({ name1: 'Test' })
            .then(doc => {
                assert(doc);
                assert(doc.name1);
            });
    });
});