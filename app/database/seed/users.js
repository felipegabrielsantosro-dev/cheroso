import { fakerPT_BR as faker } from '@faker-js/faker';

export async function seed(knex) {
  await knex('users').del();
  const total = 1000;
  const batchSize = 100;


  for (let i = 0; i < total; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, total - i);
    const batch = Array.from({ length: currentBatchSize }, () => ({
      nome: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      rg: faker.string.numeric(9),
      ativo: faker.datatype.boolean({ probability: 0.9 })
    }));
    await knex('users').insert(batch);
  }
}