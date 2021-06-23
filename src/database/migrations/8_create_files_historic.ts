import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('files_historic', table => {
        table.increments('id').primary();
        table.integer('commit_number').notNullable();
        table.string('repos_url').notNullable();
        table.string('filename').notNullable();
        table.string('previous_filename').notNullable();
        table.string('status').notNullable();
        table.string('raw_url').notNullable();

        table.integer('complexity_cyclomatic').notNullable().defaultTo(0);
        table.integer('lines').notNullable().defaultTo(0);
        table.integer('methods').notNullable().defaultTo(0);

        table.bigInteger('additions').notNullable();
        table.bigInteger('changes').notNullable();
        table.bigInteger('deletions').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('files_historic');
}