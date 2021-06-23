import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('rank', table => {
        table.increments('id').primary();
        table.string('repos_url').notNullable();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.integer('complexity_cyclomatic').notNullable().defaultTo(0);
        table.integer('additions').notNullable().defaultTo(0);
        table.integer('deletions').notNullable().defaultTo(0);
        table.integer('lines').notNullable().defaultTo(0);
        table.integer('methods').notNullable().defaultTo(0);
    });
}
export async function down(knex: Knex) {
    return knex.schema.dropTable('rank');
}