import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { produtoService } from '../services/produtoService';
import CadastroProduto from '../components/CadastroProduto';
import SuccessDialog from '../components/common/SuccessDialog';

const EditarProdutoPage = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      setLoading(true);
      try {
        const encontrado = await produtoService.buscarPorId(id);
        setProduto(encontrado);
      } catch (e) {
        setErro('Erro ao carregar produto.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id]);

  const handleSubmit = async (dadosEditados) => {
    try {
      await produtoService.atualizar(id, dadosEditados);
      setSuccessDialog(true);
    } catch {
      setErro('Erro ao salvar alterações.');
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/consulta-estoque');
  };

  if (loading) return <p>Carregando produto...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="editar-produto-page">
      <div className="page-container">
        <h1>Editar Produto</h1>
        <CadastroProduto
          produtoEdicao={produto}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/consulta-estoque')}
          mode="edit"
        />
      </div>

      <SuccessDialog
        isOpen={successDialog}
        title="Produto Atualizado!"
        message="As alterações do produto foram salvas com sucesso."
        countdown={3}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default EditarProdutoPage;
