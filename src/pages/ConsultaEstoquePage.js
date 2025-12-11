import React, { useEffect, useState } from 'react';
import './ConsultaEstoquePage.css';
import { produtoService } from '../services/produtoService';
import { useNavigate } from 'react-router-dom';


const ConsultaEstoquePage = () => {
  const [produto, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);  // ...existing code...
  <tbody>
    {produto.map(produto => (
      <tr key={produto.idproduto}>
        <td>{produto.nome}</td>
        <td>{produto.quantidade}</td>
        <td>{produto.idtipo}</td>
        <td>{produto.local}</td>
        <td>{produto.codigo || '-'}</td>
        <td>{produto.entrada ? new Date(produto.entrada).toLocaleString('pt-BR') : '-'}</td>
        <td>
          <button className="btn-acao editar" onClick={() => handleEditar(produto.idproduto)}>
            Editar
          </button>
          <button
            className="btn-acao excluir"
            onClick={() => handleExcluir(produto.idproduto)}
            disabled={excluindoId === produto.idproduto}
          >
            {excluindoId === produto.idproduto ? 'Excluindo...' : 'Excluir'}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
  // ...existing code...
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (e) {
      console.error('Erro detalhado ao carregar produtos:', e); // <-- Adicione esta linha
      setErro('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
    // eslint-disable-next-line
  }, []);

  const handleEditar = (id) => {
    navigate(`/editar-produto/${id}`);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    setExcluindoId(id);
    try {
      await produtoService.excluir(id);
      await fetchProdutos();
    } catch (e) {
      alert('Erro ao excluir produto.');
    } finally {
      setExcluindoId(null);
    }
  };

  const handleImportar = async () => {
    const confirmacao = window.confirm('Tem certeza que deseja importar os produtos?');
    if (!confirmacao) return;

    setLoading(true);
    try {
      const response = await produtoService.importar();
      alert(response.message || 'Produtos importados com sucesso!');
      await fetchProdutos();
    } catch (e) {
      console.error('Erro ao importar produtos:', e);
      alert('Erro ao importar produtos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consulta-estoque-page">
      <div className="page-container">
        <h1>Consulta de Estoque</h1>
        {loading && <p>Carregando produtos...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && produto.length === 0 && (
          <p>Nenhum produto cadastrado.</p>
        )}
        {!loading && !erro && produto.length > 0 && (
          <div className="estoque-tabela-wrapper">
            <table className="estoque-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Tipo</th>
                  <th>Localização</th>
                  <th>Código</th>
                  {/* <th>Data Cadastro</th> */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produto.map(produto => (
                  <tr key={produto.idproduto}>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{produto.idtipo}</td>
                    <td>{produto.local}</td>
                    <td>{produto.codigo || '-'}</td>
                    {/* <td>{produto.entrada ? new Date(produto.entrada).toLocaleString('pt-BR') : '-'}</td> */}
                    <td>
                      <button className="btn-acao editar" onClick={() => handleEditar(produto.idproduto)}>
                        Editar
                      </button>
                      <button
                        className="btn-acao excluir"
                        onClick={() => handleExcluir(produto.idproduto)}
                        disabled={excluindoId === produto.idproduto}
                      >
                        {excluindoId === produto.idproduto ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="acoes-container">
          <button className="btn-acao importar" onClick={handleImportar}>
            Importar Produtos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultaEstoquePage;