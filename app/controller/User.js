import connection from '../database/Connection.js';

export default class User {
    static table = 'users';
    static #columns = ['id', 'nome', 'cpf', 'rg', null];
    static #searchable = ['nome', 'cpf', 'rg'];

    static async insert(data) {
        if (!data.nome) return { status: false, msg: 'Nome é obrigatório' };
        try {
            const clean = User.#sanitize(data);
            const [result] = await connection(User.table).insert(clean).returning('*');
            return { status: true, msg: 'Usuário salvo!', id: result.id, data: [result] };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static async find(data = {}) {
        const { term = '', limit = 10, offset = 0, orderType = 'asc', column = 0, draw = 1 } = data;
        const [{ count: total }] = await connection(User.table).count('id as count');
        
        const search = term?.trim();
        const applySearch = (query) => {
            if (search) {
                query.where(function () {
                    for (const col of User.#searchable) {
                        this.orWhereRaw(`CAST("${col}" AS TEXT) ILIKE ?`, [`%${search}%`]);
                    }
                });
            }
            return query;
        };

        const filteredQ = connection(User.table).count('id as count');
        applySearch(filteredQ);
        const [{ count: filtered }] = await filteredQ;

        const orderColumn = User.#columns[column] || 'id';
        const dataQ = connection(User.table).select('*');
        applySearch(dataQ);
        const rows = await dataQ.orderBy(orderColumn, orderType).limit(limit).offset(offset);

        return { draw, recordsTotal: total, recordsFiltered: filtered, data: rows };
    }

    static async update(id, data) {
        try {
            const clean = User.#sanitize(data);
            delete clean.id;
            const [result] = await connection(User.table).where({ id }).update(clean).returning('*');
            return { status: true, msg: 'Usuário atualizado!', data: [result] };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static async delete(id) {
        try {
            await connection(User.table).where({ id }).del();
            return { status: true, msg: 'Usuário excluído!' };
        } catch (err) {
            return { status: false, msg: 'Erro: ' + err.message };
        }
    }

    static async findById(id) {
        return await connection(User.table).where({ id }).first() || null;
    }

    static async count() {
        const [{ count }] = await connection(User.table).count('id as count');
        return parseInt(count);
    }

    static #sanitize(data) {
        const ignore = ['id', 'action'];
        const clean = {};
        for (const [key, value] of Object.entries(data)) {
            if (ignore.includes(key) || value === '' || value == null) continue;
            clean[key] = (value === 'true' || value === 'false') ? (value === 'true') : value;
        }
        return clean;
    }
}