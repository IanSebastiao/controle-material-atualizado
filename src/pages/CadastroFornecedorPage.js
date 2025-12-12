import React, { useEffect, useState, useRef } from 'react';
import FornecedorForm from '../components/fornecedorform';
import ConfirmDialog from '../components/common/ConfirmDialog';
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
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, fornecedor: null });
  const resetFormRef = useRef(null);

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
        // Limpa os campos do formulário após cadastro bem-sucedido
        if (resetFormRef.current) {
          resetFormRef.current();
        }
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

  const handleDeleteClick = (fornecedor) => {
    setDeleteDialog({ isOpen: true, fornecedor });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.fornecedor) return;
    
    const fornecedor = deleteDialog.fornecedor;
    const id = fornecedor.idfornecedor ?? fornecedor.id;
    
    try {
      setLoading(true);
      await deleteFornecedor(id);
      setFornecedores((prev) => prev.filter((f) => (f.idfornecedor ?? f.id) !== id));
      setMensagem('Fornecedor excluído com sucesso!');
      setDeleteDialog({ isOpen: false, fornecedor: null });
    } catch (e) {
      setMensagem(e.message || 'Falha ao excluir fornecedor');
    } finally {
      setLoading(false);
      setTimeout(() => setMensagem(''), 2500);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, fornecedor: null });
  };

  return (
    <div className="cadastro-fornecedor-page">
      <div className="page-container">
        <div className="card form-card">
          <div className="card-body">
            <h1>{editingFornecedor ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor'}</h1>

            {mensagem && <div className="alert alert-success">{mensagem}</div>}

            <FornecedorForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingFornecedor}
              mode={editingFornecedor ? 'edit' : 'create'}
              onFormReset={(resetFn) => { resetFormRef.current = resetFn; }}
            />

            {loading && <div className="alert alert-info">Carregando...</div>}
          </div>
        </div>

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
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(f)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default CadastroFornecedorPage;