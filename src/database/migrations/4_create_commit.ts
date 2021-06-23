import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('commit', table => {
        table.increments('id').primary();
        table.string('repos_url').notNullable();
        table.integer('qtd').notNullable().defaultTo(0);
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('commit');
}