import React, { useEffect, useState } from 'react';
import './ConsultaUsuariosPage.css';
import { usuarioService } from '../services/usuarioService';
import { useNavigate } from 'react-router-dom';

const ConsultaUsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const lista = await usuarioService.listar();
      setUsuarios(lista);
    } catch (e) {
      console.error('Erro detalhado ao carregar usuários:', e);
      setErro('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line
  }, []);

  const handleEditar = (id) => {
    navigate(`/editar-usuario/${id}`);
  };

  const handleExcluir = async (usuario) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setExcluindoId(usuario.id);
    try {
      await usuarioService.excluir(usuario.id);
      await fetchUsuarios();
    } catch (e) {
      alert('Erro ao excluir usuário.');
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <div className="consulta-usuarios-page">
      <div className="page-container">
        <h1>Consulta de Usuários</h1>
        {loading && <p>Carregando usuários...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && usuarios.length === 0 && (
          <p>Nenhum usuário cadastrado.</p>
        )}
        {!loading && !erro && usuarios.length > 0 && (
          <div className="usuarios-tabela-wrapper">
            <table className="usuarios-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <button className="btn-acao editar" onClick={() => handleEditar(usuario.id)}>
                        Editar
                      </button>
                      <button
                        className="btn-acao excluir"
                        onClick={() => handleExcluir(usuario)}
                        disabled={excluindoId === usuario.id}
                      >
                        {excluindoId === usuario.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaUsuariosPage;
