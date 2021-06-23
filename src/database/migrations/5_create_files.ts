import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('files', table => {
        table.increments('id').primary();
        table.string('repos_url').notNullable();
        table.string('filename').notNullable();
        table.integer('complexity_cyclomatic').notNullable().defaultTo(0);
        table.integer('lines').notNullable().defaultTo(0);
        table.integer('methods').notNullable().defaultTo(0);
        table.string('laststatus').notNullable().defaultTo("added");
    });
}
export async function down(knex: Knex) {
    return knex.schema.dropTable('files');
}