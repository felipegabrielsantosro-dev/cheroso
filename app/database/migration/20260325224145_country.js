export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.comment('Tabela de países disponíveis no sistema, linguísticas e monetárias de cada país.');
        table.bigIncrements('id').primary();
        table.text('codigo').nullable();
        table.text('nome').nullable();
        table.text('localizacao').nullable();
        table.text('lingua').nullable();
        table.text('moeda').nullable();
        table.timestamp('criado_em', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        table.timestamp('atualizado_em', { useTz: false })
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
    });
};

export function down(knex) {
    return knex.schema.dropTable('country');
};