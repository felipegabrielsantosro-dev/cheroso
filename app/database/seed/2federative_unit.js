const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export async function seed(knex) {
  const response = await fetch(URL_ESTADOS);
  if (!response.ok) {
    throw new Error(`Falha ao buscar os dados dos estados: ${response.statusText}`);
  }

  const estados = await response.json();
  // Busca o ID do Brasil gerado na seed anterior
  const brasil = await knex('country').select('id').where('codigo', 'BR').first();
  
  if (!brasil) {
    throw new Error('País Brasil (BR) não encontrado. Rode a seed de países primeiro.');
  }

  await knex('federative_unit').del();

  const dados = estados.map((estado) => ({
    id_pais: brasil.id,
    codigo: String(estado.id),
    nome: estado.nome,
    sigla: estado.sigla,
  }));

  await knex('federative_unit').insert(dados);
  console.log(`${dados.length} estados inseridos!`);
}