export function up(knex) {
    return knex.schema.createTable('contact', (table) => {
        table.bigIncrements('id').primary();
        table.text('tipo').notNullable();
        table.text('valor').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        table.timestamps(true, true);
    });
};

export function down(knex) {
    return knex.schema.dropTable('contact');
};