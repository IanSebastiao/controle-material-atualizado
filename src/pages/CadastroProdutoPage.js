import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicione esta linha
import CadastroProduto from '../components/CadastroProduto';
import './CadastroProdutoPage.css';

const CadastroProdutoPage = ({ onSubmit, mode = 'create' }) => {
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate(); // Adicione esta linha

  const handleSubmit = () => {
    window.alert('Produto cadastrado com sucesso!'); // Alerta nativo
    setMensagem(
      mode === 'create' 
        ? 'Produto cadastrado com sucesso!' 
        : 'Produto atualizado com sucesso!'
    );
    setTimeout(() => {
      setMensagem('');
      navigate('/consulta-estoque');
    }, 1000);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="cadastro-produto-page">
      <div className="page-container">
        <h1>
          {mode === 'create' ? 'Cadastrar Novo Produto' : 'Editar Produto'}
        </h1>
        
        {mensagem && (
          <div className="alert alert-success">
            {mensagem}
          </div>
        )}
        
        <CadastroProduto 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default CadastroProdutoPage;