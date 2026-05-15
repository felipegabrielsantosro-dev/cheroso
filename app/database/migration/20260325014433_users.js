export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf').notNullable().unique();
        table.text('rg').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.timestamps(true, true);
    });
};

export function down(knex) {
    return knex.schema.dropTable('users');
};