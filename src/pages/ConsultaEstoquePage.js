import React, { useEffect, useState } from 'react';
import './ConsultaEstoquePage.css';
import { produtoService } from '../services/produtoService';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConsultaEstoquePage = () => {
  const [produto, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, produtoId: null, produtoNome: null });
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const lista = await produtoService.listar();
      setProdutos(lista);
    } catch (e) {
      console.error('Erro detalhado ao carregar produtos:', e);
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

  const handleDeleteClick = (produtoId, produtoNome) => {
    setDeleteDialog({ isOpen: true, produtoId, produtoNome });
  };

  const handleDeleteConfirm = async () => {
    const produtoId = deleteDialog.produtoId;
    setExcluindoId(produtoId);
    try {
      await produtoService.excluir(produtoId);
      await fetchProdutos();
      setDeleteDialog({ isOpen: false, produtoId: null, produtoNome: null });
    } catch (e) {
      console.error('Erro ao excluir produto:', e);
      setErro('Erro ao excluir produto.');
    } finally {
      setExcluindoId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, produtoId: null, produtoNome: null });
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produto.map(p => (
                  <tr key={p.idproduto}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>{p.idtipo}</td>
                    <td>{p.local}</td>
                    <td>{p.codigo || '-'}</td>
                    <td>
                      <button className="btn-acao editar" onClick={() => handleEditar(p.idproduto)}>
                        Editar
                      </button>
                      <button
                        className="btn-acao excluir"
                        onClick={() => handleDeleteClick(p.idproduto, p.nome)}
                        disabled={excluindoId === p.idproduto}
                      >
                        {excluindoId === p.idproduto ? 'Excluindo...' : 'Excluir'}
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

      <ConfirmDialog
              isOpen={deleteDialog.isOpen}
              title="Excluir Fornecedor"
              message={`Tem certeza que deseja excluir o fornecedor "${deleteDialog.fornecedor?.nome}"? Esta ação não pode ser desfeita.`}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              confirmText="Excluir"
              cancelText="Cancelar"
              isDanger={true}
              showUndoTimer={true}
              undoTimeout={5}
            />
    </div>
  );
};

export default ConsultaEstoquePage;