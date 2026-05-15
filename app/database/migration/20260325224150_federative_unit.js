export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.comment('Tabela de estados disponíveis no sistema');
        table.bigIncrements('id').primary();
        table.bigInteger('id_pais');
        table.text('codigo').nullable();
        table.text('nome').nullable();
        table.text('sigla').nullable();
        table.timestamp('criado_em', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        table.timestamp('atualizado_em', { useTz: false })
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table
            .foreign('id_pais')
            .references('id')
            .inTable('country')
            .onDelete('CASCADE')
            .onUpdate('NO ACTION');
    });
};

export function down(knex) {
    return knex.schema.dropTable('federative_unit');
};