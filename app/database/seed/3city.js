const URL_MUNICIPIOS = (codigoEstado) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${codigoEstado}/municipios`;

export async function seed(knex) {
  const estados = await knex('federative_unit').select('id', 'codigo');
  
  if (!estados.length) {
    throw new Error('Nenhum estado encontrado. Rode a seed de estados primeiro.');
  }

  await knex('city').del();

  for (const estado of estados) {
    const response = await fetch(URL_MUNICIPIOS(estado.codigo));
    if (!response.ok) continue;

    const municipios = await response.json();
    const dados = municipios.map((municipio) => ({
      id_uf: estado.id,
      codigo: String(municipio.id),
      nome: municipio.nome,
    }));

    // Inserção em lotes para cada estado para evitar erros de timeout
    await knex('city').insert(dados);
    console.log(`Inseridas ${dados.length} cidades para o estado ${estado.codigo}`);
  }
}