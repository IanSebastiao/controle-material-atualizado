import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductList = ({ products = [], onDelete }) => {
  const [query, setQuery] = useState('');
  const [localProducts, setLocalProducts] = useState(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleDelete = async (product) => {
    const name = product.nome || product.codigo || 'este produto';
    const ok = window.confirm(`Confirma exclusão do produto "${name}"? Esta ação não pode ser desfeita.`);
    if (!ok) return;

    try {
      if (typeof onDelete === 'function') {
        // permite que o caller faça a remoção no backend; se onDelete lançar/retornar false, não remove localmente
        const result = onDelete(product);
        // aguarda caso onDelete seja uma Promise
        const resolved = result instanceof Promise ? await result : result;
        // se onDelete explicitamente retornar false, aborta remoção local
        if (resolved === false) return;
      }

      setLocalProducts((prev) => prev.filter((p) => (p.id ?? p.codigo) !== (product.id ?? product.codigo)));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  };

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return localProducts;
    return localProducts.filter(p =>
      (p.nome || '').toLowerCase().includes(q) ||
      (p.codigo || '').toLowerCase().includes(q)
    );
  }, [localProducts, query]);

  return (
    <div className="product-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Listagem de Produtos</h2>
        <input
          aria-label="search"
          placeholder="Pesquisar por nome ou código"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Nenhum produto encontrado</div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id ?? p.codigo}>
                <td>{p.nome}</td>
                <td>{p.codigo}</td>
                <td>{p.quantidade ?? '-'}</td>
                <td>
                  <button
                    type="button"
                    aria-label={`delete-${p.id ?? p.codigo}`}
                    onClick={() => handleDelete(p)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    codigo: PropTypes.string,
    quantidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  onDelete: PropTypes.func, // func(product) => void | false | Promise
};

export default ProductList;