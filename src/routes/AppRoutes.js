import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CadastroProdutoPage from '../pages/CadastroProdutoPage';
import EditarProdutoPage from '../pages/EditarProdutoPage';
import ConsultaEstoquePage from '../pages/ConsultaEstoquePage';
import MovimentacoesPage from '../pages/MovimentacoesPage';
import CadastroFornecedorPage from '../pages/CadastroFornecedorPage';
import EditarUsuarioPage from '../pages/EditarUsuarioPage';
import ConsultaUsuariosPage from '../pages/ConsultaUsuariosPage';
import { produtoService } from '../services/produtoService';
import { movimentacaoService } from '../services/movimentacaoService';
import { usuarioService } from '../services/usuarioService';

const AppRoutes = () => {
  const navigate = useNavigate();

  // Handlers para Produtos
  const handleAddProduto = async (produtoData) => {
    try {
      await produtoService.cadastrar(produtoData);
      alert('Produto cadastrado com sucesso!');
      navigate('/consulta-estoque');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto. Tente novamente.');
    }
  };

  // Handlers para Movimentações
  const handleAddMovimentacao = async (movimentacaoData) => {
    try {
      await movimentacaoService.registrar(movimentacaoData);
      alert('Movimentação registrada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação. Tente novamente.');
    }
  };

  const handleEditMovimentacao = async (id, movimentacaoData) => {
    try {
    
      await movimentacaoService.atualizar(id, movimentacaoData);
      alert('Movimentação atualizada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
      alert('Erro ao atualizar movimentação. Tente novamente.');
    }
  };

  // Componente NotFoundPage interno
  const NotFoundPage = () => (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <button onClick={() => navigate('/')}>Voltar para Home</button>
    </div>
  );

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <HomePage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de Produtos */}
      <Route path="/cadastro-produto" element={
        <ProtectedRoute>
          <Layout>
            <CadastroProdutoPage
              onSubmit={handleAddProduto}
              mode="create"
            />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/editar-produto/:id" element={
        <ProtectedRoute>
          <Layout>
            <EditarProdutoPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/consulta-estoque" element={
        <ProtectedRoute>
          <Layout>
            <ConsultaEstoquePage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de Movimentações */}
      <Route path="/movimentacoes/nova" element={
        <ProtectedRoute>
          <Layout>
            <MovimentacoesPage
              onSubmit={handleAddMovimentacao}
              mode="create"
            />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/movimentacoes/editar/:id" element={
        <ProtectedRoute>
          <Layout>
            <MovimentacoesPage
              onSubmit={handleEditMovimentacao}
              mode="edit"
            />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/movimentacoes" element={
        <ProtectedRoute>
          <Layout>
            <MovimentacoesPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de Usuários - Apenas para administradores */}
      <Route path="/usuarios" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <ConsultaUsuariosPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/editar-usuario/:id" element={
        <ProtectedRoute requireAdmin={true}>
          <Layout>
            <EditarUsuarioPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rotas de Fornecedores */}
      <Route path="/fornecedores" element={
        <ProtectedRoute>
          <Layout>
            <CadastroFornecedorPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Rota 404 */}
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <NotFoundPage />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;