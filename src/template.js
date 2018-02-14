
const schema = {
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
            validate: doc => doc.email.endsWith('gmail.com') ?
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
    validator: doc => doc.password1 != doc.password2 ? 'Invalid password' : null
};
