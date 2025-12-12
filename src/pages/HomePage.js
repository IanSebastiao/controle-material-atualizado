import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtoService } from '../services/produtoService';
import { getFornecedores } from '../services/fornecedorService';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProdutos: 0,
    itensEstoque: 0,
    totalFornecedores: 0,
    loading: true,
    error: null
  });

  const features = [
    {
      title: 'Cadastro de Produtos',
      description: 'Cadastre novos produtos no sistema de estoque',
      icon: '📦',
      path: '/cadastro-produto',
      color: '#4CAF50'
    },
    {
      title: 'Consultar Estoque',
      description: 'Consulte produtos em estoque e suas quantidades',
      icon: '🔍',
      path: '/consulta-estoque',
      color: '#2196F3'
    },
    {
      title: 'Movimentações',
      description: 'Controle de entradas e saídas do estoque',
      icon: '📊',
      path: '/movimentacoes',
      color: '#FF9800'
    },
    {
      title: 'Fornecedores',
      description: 'Gerenciamento de fornecedores',
      icon: '🏢',
      path: '/fornecedores',
      color: '#9C27B0'
    }
  ];

  useEffect(() => {
    let active = true;
    if (process.env.NODE_ENV === 'test') return;

    (async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));

        // Busca produtos
        const produtos = await produtoService.listar();
        const totalProdutos = produtos?.length || 0;
        
        // Calcula itens em estoque (soma de quantidades)
        const itensEstoque = produtos?.reduce((sum, p) => sum + (p.quantidade || 0), 0) || 0;

        // Busca fornecedores
        const fornecedores = await getFornecedores();
        const totalFornecedores = fornecedores?.length || 0;

        if (!active) return;

        setStats({
          totalProdutos,
          itensEstoque,
          totalFornecedores,
          loading: false,
          error: null
        });
      } catch (err) {
        if (!active) return;
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Erro ao carregar estatísticas'
        }));
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Sistema de Controle de Estoque</h1>
        <p>Gerencie seu estoque de forma eficiente e organizada</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => handleCardClick(feature.path)}
            style={{ '--card-color': feature.color }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="feature-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h4>Total de Produtos</h4>
          <span className="stat-number">
            {stats.loading ? '...' : stats.totalProdutos}
          </span>
        </div>
        <div className="stat-card">
          <h4>Itens em Estoque</h4>
          <span className="stat-number">
            {stats.loading ? '...' : stats.itensEstoque}
          </span>
        </div>
        <div className="stat-card">
          <h4>Fornecedores</h4>
          <span className="stat-number">
            {stats.loading ? '...' : stats.totalFornecedores}
          </span>
        </div>
      </div>

      {stats.error && (
        <div className="error-message">
          ⚠️ {stats.error}
        </div>
      )}
    </div>
  );
};

export default HomePage;