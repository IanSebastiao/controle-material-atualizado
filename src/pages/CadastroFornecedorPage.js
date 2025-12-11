import React, { useEffect, useState } from 'react';
import FornecedorForm from '../components/fornecedorform';
import {
  addFornecedor,
  getFornecedores,
  updateFornecedor,
  deleteFornecedor,
} from '../services/fornecedorService';
import './CadastroFornecedorPage.css';

const CadastroFornecedorPage = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [editingFornecedor, setEditingFornecedor] = useState(null);

  useEffect(() => {
    let active = true;
    if (process.env.NODE_ENV === 'test') return;
    (async () => {
      setLoading(true);
      try {
        const rows = await getFornecedores();
        if (!active) return;
        setFornecedores(rows);
      } catch (e) {
        if (!active) return;
        setMensagem(e.message || 'Falha ao carregar fornecedores');
      } finally {
        if (!active) return;
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      if (editingFornecedor) {
        const id = editingFornecedor.idfornecedor ?? editingFornecedor.id;
        const updated = await updateFornecedor(id, payload);
        setFornecedores((prev) => prev.map((f) => ((f.idfornecedor ?? f.id) === (updated.idfornecedor ?? updated.id) ? updated : f)));
        setMensagem('Fornecedor atualizado com sucesso!');
        setEditingFornecedor(null);
      } else {
        const saved = await addFornecedor(payload);
        setFornecedores((prev) => [saved, ...prev]);
        setMensagem('Fornecedor cadastrado com sucesso!');
      }
    } catch (e) {
      setMensagem(e.message || 'Falha ao salvar fornecedor');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 2500);
    }
  };

  const handleEdit = (fornecedor) => {
    setEditingFornecedor(fornecedor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingFornecedor(null);
  };

  const handleDelete = async (fornecedor) => {
    const id = fornecedor.idfornecedor ?? fornecedor.id;
    if (!window.confirm(`Confirma excluir ${fornecedor.nome}?`)) return;
    try {
      setLoading(true);
      await deleteFornecedor(id);
      setFornecedores((prev) => prev.filter((f) => (f.idfornecedor ?? f.id) !== id));
      setMensagem('Fornecedor excluído com sucesso!');
    } catch (e) {
      setMensagem(e.message || 'Falha ao excluir fornecedor');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 2500);
    }
  };

  return (
    <div className="cadastro-fornecedor-page">
      <div className="page-container">
        <h1>{editingFornecedor ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}</h1>

        {mensagem && <div className="alert alert-success">{mensagem}</div>}

        <FornecedorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingFornecedor}
          mode={editingFornecedor ? 'edit' : 'create'}
        />

        {loading && <div className="alert alert-info">Carregando...</div>}

        <h2 className="mt-4">Fornecedores cadastrados</h2>
        {fornecedores.length === 0 ? (
          <p className="text-muted">Nenhum fornecedor cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((f) => (
                  <tr key={f.idfornecedor ?? f.id}>
                    <td>{f.nome}</td>
                    <td>{f.cnpj}</td>
                    <td>{f.email}</td>
                    <td>{f.telefone}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(f)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f)}>Excluir</button>
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

export default CadastroFornecedorPage;
