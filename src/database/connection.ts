import knex from 'knex';

const configuration = require('../../knexfile');

var config = '';
if(process.env.NODE_ENV != 'production'){
    config = process.env.NODE_ENV == 'test' ? configuration.test : configuration.development;
}else {
    config = configuration.production;
}

const connection = knex(config);

export default connection;