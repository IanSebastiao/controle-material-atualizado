import React, { useEffect, useState } from 'react';
import './ConsultaEstoquePage.css';
import { produtoService } from '../services/produtoService';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ConsultaEstoquePage = () => {
  const [produto, setProdutos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, produtoId: null, produtoNome: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('data-desc');
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

  const fetchTipos = async () => {
    try {
      const tiposData = await produtoService.listarTipos();
      setTipos(tiposData || []);
    } catch (e) {
      console.error('Erro ao carregar tipos:', e);
      setTipos([]);
    }
  };

  useEffect(() => {
    fetchProdutos();
    fetchTipos();
    // eslint-disable-next-line
  }, []);

  // Função para obter o nome do tipo pelo ID
  const getTipoNome = (idtipo) => {
    const tipo = tipos.find(t => String(t.idtipo) === String(idtipo));
    return tipo ? tipo.tipo : `Tipo ${idtipo}`;
  };

  // Função para filtrar e ordenar produtos
  const getFilteredAndSortedProdutos = () => {
    let filtered = produto;

    // Filtrar por termo de pesquisa
    if (searchTerm.trim()) {
      filtered = filtered.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo && p.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getTipoNome(p.idtipo).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar produtos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome-asc':
          return a.nome.localeCompare(b.nome);
        case 'nome-desc':
          return b.nome.localeCompare(a.nome);
        case 'quantidade-asc':
          return a.quantidade - b.quantidade;
        case 'quantidade-desc':
          return b.quantidade - a.quantidade;
        case 'tipo-asc':
          return getTipoNome(a.idtipo).localeCompare(getTipoNome(b.idtipo));
        case 'tipo-desc':
          return getTipoNome(b.idtipo).localeCompare(getTipoNome(a.idtipo));
        case 'data-asc':
          return new Date(a.entrada || 0) - new Date(b.entrada || 0);
        case 'data-desc':
          return new Date(b.entrada || 0) - new Date(a.entrada || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

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
        
        {/* Barra de pesquisa e filtros */}
        <div className="search-filter-bar" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Pesquisar por nome, código ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ minWidth: '200px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="nome-asc">Nome (A-Z)</option>
              <option value="nome-desc">Nome (Z-A)</option>
              <option value="quantidade-desc">Maior Quantidade</option>
              <option value="quantidade-asc">Menor Quantidade</option>
              <option value="tipo-asc">Tipo (A-Z)</option>
              <option value="tipo-desc">Tipo (Z-A)</option>
              <option value="data-desc">Mais Recente</option>
              <option value="data-asc">Mais Antigo</option>
            </select>
          </div>
          
          {(searchTerm || sortBy !== 'data-desc') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('data-desc');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Limpar Filtros
            </button>
          )}
        </div>
        
        {loading && <p>Carregando produtos...</p>}
        {erro && <p className="erro">{erro}</p>}
        {!loading && !erro && produto.length === 0 && (
          <p>Nenhum produto cadastrado.</p>
        )}
        {!loading && !erro && produto.length > 0 && (
          <div className="estoque-tabela-wrapper">
            <div style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
              Mostrando {getFilteredAndSortedProdutos().length} de {produto.length} produtos
            </div>
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
                {getFilteredAndSortedProdutos().map(p => (
                  <tr key={p.idproduto}>
                    <td>{p.nome}</td>
                    <td>{p.quantidade}</td>
                    <td>{getTipoNome(p.idtipo)}</td>
                    <td>{p.local}</td>
                    <td>{p.codigo || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
                      </div>
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