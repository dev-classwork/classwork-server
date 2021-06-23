import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('classes_teams', table => {
        table.increments('id').primary();
        table.integer('class_id').notNullable().references('id').inTable('classes');
        table.integer('team_id').notNullable().references('id').inTable('teams');
    });
}
export async function down(knex: Knex) {
    return knex.schema.dropTable('classes_teams');
}