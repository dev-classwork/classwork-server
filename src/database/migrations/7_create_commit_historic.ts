import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('commit_historic', table => {
        table.increments('id').primary();
        table.integer('commit_number').notNullable();
        table.string('repos_url').notNullable();
        table.string('author').notNullable();
        table.string('author_avatar').notNullable();
        table.string('date').notNullable();
        table.string('message').notNullable();
        table.string('tree').notNullable();

        table.integer('complexity_cyclomatic').notNullable().defaultTo(0);
        table.integer('lines').notNullable().defaultTo(0);
        table.integer('methods').notNullable().defaultTo(0);
        
        table.bigInteger('additions').notNullable();
        table.bigInteger('total').notNullable();
        table.bigInteger('deletions').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('commit_historic');
}