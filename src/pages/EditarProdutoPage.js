import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { produtoService } from '../services/produtoService';
import CadastroProduto from '../components/CadastroProduto';

const EditarProdutoPage = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
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
      setMensagem('Produto atualizado com sucesso!');
      setTimeout(() => {
        setMensagem('');
        navigate('/consulta-estoque');
      }, 1500);
    } catch {
      setErro('Erro ao salvar alterações.');
    }
  };

  if (loading) return <p>Carregando produto...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="editar-produto-page">
      <div className="page-container">
        <h1>Editar Produto</h1>
        {mensagem && (
          <div className="alert alert-success">
            {mensagem}
          </div>
        )}
        <CadastroProduto
          produtoEdicao={produto}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/consulta-estoque')}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default EditarProdutoPage;
