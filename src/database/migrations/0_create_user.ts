import Knex from 'knex';

export async function up(knex: Knex) {
    return await knex.schema.createTable('users', function(table){
        table.increments('id');
        table.integer('git_id');
        table.string('id_auth').notNullable();
        table.string('type').notNullable();
        table.string('real_name').notNullable();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.json('classes');
        table.json('urls');
    });
};

export async function down(knex: Knex){
    return await knex.schema.dropTable('users');
};
