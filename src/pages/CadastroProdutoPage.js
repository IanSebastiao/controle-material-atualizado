import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CadastroProduto from '../components/CadastroProduto';
import SuccessDialog from '../components/common/SuccessDialog';
import './CadastroProdutoPage.css';

const CadastroProdutoPage = ({ onSubmit, mode = 'create' }) => {
  const [successDialog, setSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/consulta-estoque');
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="cadastro-produto-page">
      <div className="page-container">
        <div className="card form-card">
          <div className="card-body">
            <h1>{mode === 'create' ? 'Cadastrar Novo Produto' : 'Editar Produto'}</h1>
            
            <CadastroProduto 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              mode={mode}
            />
          </div>
        </div>
      </div>

      <SuccessDialog
        isOpen={successDialog}
        title={mode === 'create' ? 'Produto Cadastrado!' : 'Produto Atualizado!'}
        message={mode === 'create' 
          ? 'Seu produto foi cadastrado com sucesso no sistema.'
          : 'As alterações do produto foram salvas com sucesso.'
        }
        countdown={3}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default CadastroProdutoPage;