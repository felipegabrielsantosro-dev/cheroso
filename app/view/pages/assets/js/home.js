async function loadCounts() {
    const [totalProdutos, totalClientes, totalFornecedores, totalEmpresas, totalUsers] = await Promise.all([
        api.product.count(),
        api.customer.count(),
        api.supplier.count(),
        api.company.count(),
        api.user.count(), 
    ]);

    document.getElementById('count-produtos').textContent = totalProdutos;
    document.getElementById('count-clientes').textContent = totalClientes;
    document.getElementById('count-fornecedores').textContent = totalFornecedores;
    document.getElementById('count-empresas').textContent = totalEmpresas;
    document.getElementById('count-usuarios').textContent = totalUsers;
}

loadCounts();

api.product.onReload(() => loadCounts());
api.customer.onReload(() => loadCounts());
api.supplier.onReload(() => loadCounts());
api.company.onReload(() => loadCounts());
api.user.onReload(() => loadCounts());