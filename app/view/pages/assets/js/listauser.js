const table = Datatables.SetTable('#table-users', [
    { data: 'id', className: 'text-center' },
    { data: 'nome' },
    { data: 'cpf', defaultContent: '-' },
    { data: 'rg', defaultContent: '-' },
    {
        data: 'ativo',
        className: 'text-center',
        orderable: false,
        searchable: false,
        render: function (data) {
            return data
                ? `<span class="badge bg-success">Ativo</span>`
                : `<span class="badge bg-secondary">Inativo</span>`;
        }
    },
    {
        data: null,
        className: 'text-center',
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editUser(${row.id})" class="btn btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteUser(${row.id})" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.user.find(filter));

api.user.onReload(() => {
    table.ajax.reload(null, false);
});

async function deleteUser(id) {
    const result = await Swal.fire({
        title: 'Excluir usuário?',
        text: 'Esta ação removerá o acesso do usuário ao sistema.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
        const response = await api.user.delete(id);
        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editUser(id) {
    try {
        const user = await api.user.findById(id);
        if (!user) {
            toast('error', 'Erro', 'Usuário não encontrado.');
            return;
        }
        await api.temp.set('user:edit', { action: 'e', ...user });
        api.window.openModal('pages/user', {
            width: 800,
            height: 600,
            title: 'Editar Usuário',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteUser = deleteUser;
window.editUser = editUser;