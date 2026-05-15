import connection from '../database/Connection.js';

export default class Product {

    static table = 'product';

    static #columns = ['id', 'nome', 'codigo_barra', 'unidade', 'preco_compra', 'margem_lucro', 'preco_venda', 'descricao', 'ativo', 'criado_em', 'atualizado_em', null];

    static #searchable = ['nome', 'codigo_barra', 'unidade', 'descricao'];

    static async insert(data) {
        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', id: null, data: [] };
        }

        try {
            const clean = Product.#sanitize(data);

            const [result] = await connection(Product.table)
                .insert(clean)
                .returning('*');

            return { status: true, msg: 'Salvo com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, id: null, data: [] };
        }
    }

    static async find(data = {}) {
        const { term = '', limit = 10, offset = 0, orderType = 'asc', column = 0, draw = 1 } = data;

        const [{ count: total }] = await connection(Product.table)
            .where({ excluido: false })
            .count('id as count');

        const search = term?.trim();

        function applySearch(query) {
            query.where({ excluido: false });
            if (search) {
                query.where(function () {
                    for (const col of Product.#searchable) {
                        this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                    }
                });
            }
            return query;
        }

        const filteredQ = connection(Product.table).count('id as count');
        applySearch(filteredQ);
        const [{ count: filtered }] = await filteredQ;

        const orderColumn = Product.#columns[column] || 'id';
        const orderDir = orderType === 'desc' ? 'desc' : 'asc';

        const dataQ = connection(Product.table).select('*');
        applySearch(dataQ);
        dataQ.orderBy(orderColumn, orderDir);
        dataQ.limit(parseInt(limit));
        dataQ.offset(parseInt(offset));

        const rows = await dataQ;

        return {
            draw: parseInt(draw),
            recordsTotal: parseInt(total),
            recordsFiltered: parseInt(filtered),
            data: rows,
        };
    }

    static async findById(id) {
        if (!id) return null;

        const row = await connection(Product.table)
            .where({ id, excluido: false })
            .first();

        return row || null;
    }

    static async update(id, data) {
        if (!id) return { status: false, msg: 'ID é obrigatório', data: [] };

        if (!data.nome || data.nome.trim() === '') {
            return { status: false, msg: 'O campo nome é obrigatório', data: [] };
        }

        try {
            const clean = Product.#sanitize(data);
            delete clean.id;
            clean.atualizado_em = new Date();

            const [result] = await connection(Product.table)
                .where({ id, excluido: false })
                .update(clean)
                .returning('*');

            if (!result) {
                return { status: false, msg: 'Produto não encontrado', data: [] };
            }

            return { status: true, msg: 'Atualizado com sucesso!', id: result.id, data: [result] };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message, data: [] };
        }
    }

    // Soft delete — marca como excluído em vez de apagar
    static async delete(id) {
        if (!id) return { status: false, msg: 'ID é obrigatório' };

        try {
            const [result] = await connection(Product.table)
                .where({ id, excluido: false })
                .update({ excluido: true, atualizado_em: new Date() })
                .returning('id');

            if (!result) {
                return { status: false, msg: 'Produto não encontrado' };
            }

            return { status: true, msg: 'Excluído com sucesso!' };

        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static #sanitize(data) {
        const ignore = ['id', 'action'];
        const numerics = ['preco_compra', 'margem_lucro', 'preco_venda'];
        const clean = {};

        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key)) continue;
            if (value === '' || value === null || value === undefined) continue;
            if (value === 'true') { clean[key] = true; continue; }
            if (value === 'false') { clean[key] = false; continue; }
            if (numerics.includes(key)) { clean[key] = parseFloat(value) || 0; continue; }
            clean[key] = value;
        }

        return clean;
    }
    static async count() {
        const [{ count }] = await connection(Product.table)
            .whereNot({ excluido: true })
            .count('id as count');
        return parseInt(count);
    }
}