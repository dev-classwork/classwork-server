import Knex from 'knex';

export async function up(knex: Knex) {
    return await knex.schema.createTable('teams', function(table){
        table.increments('id');
        table.string('name').notNullable();
        table.string('repos');
    });
};

export async function down(knex: Knex){
    return await knex.schema.dropTable('teams');
};
