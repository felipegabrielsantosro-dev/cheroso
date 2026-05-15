export function up(knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment('Tabela de cidades disponíveis no sistema');
        table.bigIncrements('id').primary();
        table.bigInteger('id_uf');
        table.text('codigo').nullable();
        table.text('nome').nullable();
        table.timestamp('criado_em', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        table.timestamp('atualizado_em', { useTz: false })
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table
            .foreign('id_uf')
            .references('id')
            .inTable('federative_unit')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
};

export function down(knex) {
    return knex.schema.dropTable('city');
};