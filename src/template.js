const Gab = {};

const Schema = {}, Type = Schema.Types;
const Form = {};

Schema.create({
    login: Type.string()
        .notNull()
        .max(100)
        .min(5)
        .toLower(),
    password: Type.string()
        .notNull()
        .validate(val => val != 'abcd', 'Password is too easy')
        .validate(val => val.length < 3, 'Password is too short')
});


Form.create({
    login: Type.string()
        .notNull()
        .max(100)
        .autoTrim()
        .label('Login')
        .control({
            type: 'text',
            width: '30%',
            mask: '999999', // only numbers
            disabled: (val, doc) => doc.password != null,
            hint: 'Enter the user login'
        }),
    password: Type.string()
        .notNull()
        .max(20)
        .label('Password')
        .control({
            type: 'password',
            width: '30%'
        })
});


module.exports = Gab.schema({
    username: Gab.string()
        .min(4)
        .required(),
    email: Gab.string()
        .required()
        .validator(doc => doc.email.endsWith('gmail.com') ?
            null : 'Must be a gmail account')
        .validators(['email']),
    birthDate: Gab.date()
        .min(new Date(1960, 1, 1))
        .future(true),
    subscribe: Gab.bool()
        .defaultValue(true),
    password1: Gab.bool()
        .required()
        .validator('email'),
    password2: Gab.bool()
        .required()
        .validator('email'),
    data: Gab.object({
        name: Gab.string().max(100).required(),
        address: Gab.string().max(100),
        age: Gab.number()
    }).required()
})
    .validator([
        doc => doc.password1 != doc.password2 ? 'Invalid password' : null,
        // object giving more control
        {
            isValid: doc => doc.password1 != doc.password2,
            message: 'Invalid password',
            code: 'WRONG_PWD'
        }
    ]);


module.exports = {
    properties: {
        username: {
            type: 'string',
            min: 4,
            required: true
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            validator: doc => doc.email.endsWith('gmail.com') ?
                null : 'Must be a gmail account'
        },
        birthDate: {
            type: 'date',
            min: new Date(1960, 1, 1),
            future: false
        },
        subscribe: {
            type: 'bool',
            defaultValue: true
        },
        password1: {
            type: 'string',
            required: true,
            password: true
        },
        password2: {
            type: 'string',
            required: true,
            password: true
        }
    },
    validator: doc => doc.password1 != doc.password2 ? 'Invalid password' : null,
    validators: [
        // simple function returning the message
        doc => doc.password1 != doc.password2 ? 'Invalid password' : null,
        // object giving more control
        {
            isValid: doc => doc.password1 != doc.password2,
            message: 'Invalid password',
            code: 'WRONG_PWD'
        }
    ],
    // if property is not declared or is with an unassigned value, 
    // its default value will be null
    defaultAsNull: true,
    // if true, all string values will have its whitespaces removed
    // from both ends
    autoTrim: true
};
