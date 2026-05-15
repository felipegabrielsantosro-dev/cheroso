const table = Datatables.SetTable('#table-suppliers', [
    { data: 'id', className: 'text-center' },
    { data: 'nome' },
    { data: 'cnpj', defaultContent: '-' },
    { data: 'email', defaultContent: '-' },
    { data: 'telefone', defaultContent: '-' },
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
                <button onclick="editSupplier(${row.id})" class="btn btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteSupplier(${row.id})" class="btn btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.supplier.find(filter));

api.supplier.onReload(() => {
    table.ajax.reload(null, false);
});

async function deleteSupplier(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
        const response = await api.supplier.delete(id);
        if (response.status) {
            toast('success', 'Excluído', response.msg);
            table.ajax.reload(null, false);
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editSupplier(id) {
    try {
        const supplier = await api.supplier.findById(id);
        if (!supplier) {
            toast('error', 'Erro', 'Fornecedor não encontrado.');
            return;
        }
        await api.temp.set('supplier:edit', { action: 'e', ...supplier });
        api.window.openModal('pages/supplier', {
            width: 800,
            height: 600,
            title: 'Editar Fornecedor',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}

window.deleteSupplier = deleteSupplier;
window.editSupplier = editSupplier;