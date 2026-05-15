export function up(knex) {
    return knex.schema
        .createTable('sale', (table) => {
            table.bigIncrements('id').primary();
            table.bigInteger('id_cliente').nullable();
            table.bigInteger('id_usuario').nullable();
            table.decimal('total_bruto', 18, 4).nullable();
            table.decimal('total_liquido', 18, 4).nullable().comment('Valor a ser pago pelo cliente.');
            table.decimal('desconto', 18, 4).nullable();
            table.decimal('acrescimo', 18, 4).nullable();
            table.text('observacao').nullable();
            table.timestamp('data_cadastro').nullable().defaultTo(knex.fn.now());
            table.timestamp('data_atualizacao').nullable().defaultTo(knex.fn.now());

            table.foreign('id_cliente').references('id').inTable('customer').onDelete('CASCADE').onUpdate('NO ACTION');
            table.foreign('id_usuario').references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
        })
        .then(() => knex.raw(`
            ALTER TABLE sale ADD COLUMN estado_venda stock_movement_venda;
        `));
}

export function down(knex) {
    return knex.schema.dropTable('sale');
}