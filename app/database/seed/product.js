import { fakerPT_BR as faker } from '@faker-js/faker';

export async function seed(knex) {
  await knex('product').del();
  const total = 1000;
  const batchSize = 100;

  for (let i = 0; i < total; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, total - i);
    const batch = Array.from({ length: currentBatchSize }, () => {
      const precoCompra = parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 4 }));
      const margemLucro = parseFloat(faker.number.float({ min: 10, max: 100, fractionDigits: 4 }));
      const precoVenda = parseFloat((precoCompra * (1 + margemLucro / 100)).toFixed(4));
      return {
        nome: faker.commerce.productName(),
        codigo_barra: faker.commerce.isbn({ variant: 13, separator: '' }),
        unidade: faker.helpers.arrayElement(['UN', 'KG', 'LT', 'CX', 'PCT']),
        preco_compra: precoCompra,
        margem_lucro: margemLucro,
        preco_venda: precoVenda,
        descricao: faker.commerce.productDescription(),
        ativo: faker.datatype.boolean({ probability: 0.9 }),
        excluido: false
      };
    });
    await knex('product').insert(batch);
  }
}