import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UsuarioList = ({ usuarios = [], onDelete }) => {
  const [query, setQuery] = useState('');
  const [localUsuarios, setLocalUsuarios] = useState(usuarios);

  useEffect(() => {
    setLocalUsuarios(usuarios);
  }, [usuarios]);

  const handleDelete = async (usuario) => {
    const name = usuario.nome || usuario.email || 'este usuário';
    const ok = window.confirm(`Confirma exclusão do usuário "${name}"? Esta ação não pode ser desfeita.`);
    if (!ok) return;

    try {
      if (typeof onDelete === 'function') {
        // permite que o caller faça a remoção no backend; se onDelete lançar/retornar false, não remove localmente
        const result = onDelete(usuario);
        // aguarda caso onDelete seja uma Promise
        const resolved = result instanceof Promise ? await result : result;
        // se onDelete explicitamente retornar false, aborta remoção local
        if (resolved === false) return;
      }

      setLocalUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário. Tente novamente.');
    }
  };

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return localUsuarios;
    return localUsuarios.filter(u =>
      (u.nome || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }, [localUsuarios, query]);

  return (
    <div className="usuario-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Listagem de Usuários</h2>
        <input
          aria-label="search"
          placeholder="Pesquisar por nome ou email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Nenhum usuário encontrado</div>
      ) : (
        <table className="usuario-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    type="button"
                    aria-label={`delete-${u.id}`}
                    onClick={() => handleDelete(u)}
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

UsuarioList.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    email: PropTypes.string,
  })),
  onDelete: PropTypes.func, // func(usuario) => void | false | Promise
};

export default UsuarioList;
