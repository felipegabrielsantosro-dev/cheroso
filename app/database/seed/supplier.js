import { fakerPT_BR as faker } from '@faker-js/faker';

export async function seed(knex) {
  await knex('supplier').del();
  const total = 1000;
  const batchSize = 100;


  for (let i = 0; i < total; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, total - i);
    const batch = Array.from({ length: currentBatchSize }, () => ({
      nome: faker.company.name(),
      cnpj: faker.string.numeric(14),
      email: faker.internet.email().toLowerCase(),
      telefone: faker.phone.number(),
      ativo: faker.datatype.boolean({ probability: 0.9 }),
      excluido: false
    }));
    await knex('supplier').insert(batch);
  }
}