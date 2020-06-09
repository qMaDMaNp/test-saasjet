const environment = 'development';
const config = require('../knexfile')[environment];
const knex = require('knex')(config);

module.exports = {
    insert(action = '', success = false) {
        let date = new Date().toISOString().split('T');

        knex('log').insert({
            date: date[0],
            time: date[1].substring(0, 8),
            action: action.substr(0, 255),
            ...(success && {success: true})
        })
        .catch(err => {
            console.error(err)
        })
    }
};