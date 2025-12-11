import React, { useState, useEffect } from 'react';
import './MovimentacaoForm.css';
import { movimentacaoService } from '../services/movimentacaoService';
import { produtoService } from '../services/produtoService';

const MovimentacaoForm = ({ onSubmit, onCancel, movimentacaoEdicao, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    tipo: movimentacaoEdicao?.tipo || 'entrada',
    produtoId: movimentacaoEdicao?.produtoId || '',
    quantidade: movimentacaoEdicao?.quantidade || '',
    data: movimentacaoEdicao?.data || new Date().toISOString().split('T')[0],
    responsavel: movimentacaoEdicao?.responsavel || '',
    observacao: movimentacaoEdicao?.observacao || ''
  });

  const [produtos, setProdutos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const listaProdutos = await produtoService.listar();
      setProdutos(listaProdutos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setErrors({ carregamento: 'Erro ao carregar lista de produtos' });
    } finally {
      setCarregandoProdutos(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo de movimentação é obrigatório';
    }

    if (!formData.produtoId) {
      newErrors.produtoId = 'Produto é obrigatório';
    }

    if (!formData.quantidade || formData.quantidade <= 0) {
      newErrors.quantidade = 'Quantidade é obrigatória e deve ser maior que zero';
    } else if (formData.tipo === 'entrada' && formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade deve ser positiva para entrada';
    } else if (formData.tipo === 'saida' && formData.quantidade > 0) {
      newErrors.quantidade = 'Quantidade deve ser positiva para saída (use valor positivo)';
    }

    if (!formData.data) {
      newErrors.data = 'Data da movimentação é obrigatória';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const movimentacaoData = {
        ...formData,
        quantidade: Math.abs(parseInt(formData.quantidade)),
        // Para saída, convertemos para negativo
        quantidade: formData.tipo === 'saida' ? -Math.abs(parseInt(formData.quantidade)) : Math.abs(parseInt(formData.quantidade))
      };

      await movimentacaoService.registrar(movimentacaoData);
      onSubmit?.(movimentacaoData);
      
      if (!movimentacaoEdicao) {
        setFormData({
          tipo: 'entrada',
          produtoId: '',
          quantidade: '',
          data: new Date().toISOString().split('T')[0],
          responsavel: '',
          observacao: ''
        });
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao registrar movimentação. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (carregandoProdutos) {
    return <div className="carregando">Carregando produtos...</div>;
  }

  return (
    <div className="movimentacao-form">
      <h2>{mode === 'edit' ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
      
      <form onSubmit={handleSubmit} className="movimentacao-form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipo">Tipo de Movimentação *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={errors.tipo ? 'error' : ''}
            >
              <option value="entrada">Entrada (Adicionar ao estoque)</option>
              <option value="saida">Saída (Remover do estoque)</option>
            </select>
            {errors.tipo && <span className="error-message">{errors.tipo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="data">Data da Movimentação *</label>
            <input
              type="date"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className={errors.data ? 'error' : ''}
            />
            {errors.data && <span className="error-message">{errors.data}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="produtoId">Produto *</label>
          <select
            id="produtoId"
            name="produtoId"
            value={formData.produtoId}
            onChange={handleChange}
            className={errors.produtoId ? 'error' : ''}
          >
            <option value="">Selecione um produto</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>
                {produto.name} (Estoque: {produto.quantidade})
              </option>
            ))}
          </select>
          {errors.produtoId && <span className="error-message">{errors.produtoId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantidade">
              Quantidade * 
              <small> ({formData.tipo === 'entrada' ? 'Positiva' : 'Positiva - será convertida para negativa'})</small>
            </label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              min="1"
              className={errors.quantidade ? 'error' : ''}
              placeholder="Quantidade"
            />
            {errors.quantidade && <span className="error-message">{errors.quantidade}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="responsavel">Responsável *</label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              className={errors.responsavel ? 'error' : ''}
              placeholder="Nome do responsável"
            />
            {errors.responsavel && <span className="error-message">{errors.responsavel}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="observacao">Observação</label>
          <textarea
            id="observacao"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            rows="3"
            placeholder="Observações adicionais sobre a movimentação"
          />
        </div>

        {errors.carregamento && (
          <div className="error-message carregamento-error">{errors.carregamento}</div>
        )}

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel}
            className="btn-cancelar"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-salvar"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : (mode === 'edit' ? 'Atualizar' : 'Registrar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovimentacaoForm;