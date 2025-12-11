import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovimentacoesPage.css';

const MovimentacoesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="movimentacoes-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Movimentações de Estoque</h1>
          <button 
            onClick={() => navigate('/movimentacoes/nova')}
            className="btn-nova-movimentacao"
          >
            ＋ Nova Movimentação
          </button>
        </div>
        
        <div className="movimentacoes-content">
          <div className="info-card">
            <h3>Controle de Entradas e Saídas</h3>
            <p>Registre todas as movimentações do seu estoque para manter o controle preciso.</p>
            
            <div className="features-grid">
              <div className="feature-item">
                <h4>📥 Entradas</h4>
                <p>Registro de compras, doações e retornos</p>
              </div>
              
              <div className="feature-item">
                <h4>📤 Saídas</h4>
                <p>Controle de vendas, consumo interno e perdas</p>
              </div>
              
              <div className="feature-item">
                <h4>📊 Relatórios</h4>
                <p>Histórico completo das movimentações</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/movimentacoes/nova')}
              className="btn-primary"
            >
              Começar com Nova Movimentação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovimentacoesPage;