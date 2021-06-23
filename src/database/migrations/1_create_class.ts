import Knex from 'knex';

export async function up(knex: Knex) {
    return await knex.schema.createTable('classes', function(table){
        table.increments('id');
        table.string('key').notNullable();
        table.string('name').notNullable();
        table.string('image').notNullable();
        table.text('description','longtext');
        table.string('teacher_id_auth').notNullable();
        table.integer('teacher_id').notNullable();
        table.string('color').notNullable();
    });
};

export async function down(knex: Knex){
    return await knex.schema.dropTable('classes');
};
