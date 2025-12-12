import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';
import { produtoService } from '../services/produtoService';
import { getFornecedores } from '../services/fornecedorService';

const CadastroProduto = ({ onSubmit, onCancel, produtoEdicao, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    nome: produtoEdicao?.nome || '',
    codigo: produtoEdicao?.codigo || '',
    quantidade: produtoEdicao?.quantidade || '',
    validade: produtoEdicao?.validade || '',
    local: produtoEdicao?.local || '',
    idtipo: produtoEdicao?.idtipo || '',
    idfornecedor: produtoEdicao?.idfornecedor || '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposLoading, setTiposLoading] = useState(true);

  // Buscar fornecedores cadastrados no banco
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const lista = await getFornecedores();
        setFornecedores(lista);
      } catch {
        setFornecedores([]);
      }
    };
    fetchFornecedores();
  }, []);

  // Buscar tipos do banco de dados
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        setTiposLoading(true);
        console.log('Buscando tipos do banco...');
        const tiposData = await produtoService.listarTipos();
        console.log('Dados recebidos do banco:', tiposData);

        if (tiposData && tiposData.length > 0) {
          setTipos(tiposData);
          console.log('Tipos carregados com sucesso:', tiposData.length, 'itens');
        } else {
          console.log('Nenhum tipo encontrado no banco, usando tipos padrão');
          // Tipos padrão caso não haja dados no banco
          setTipos([
            { idtipo: 1, tipo: 'Perecível' },
            { idtipo: 2, tipo: 'Não perecível' },
            { idtipo: 3, tipo: 'Outros' },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar tipos:', error);
        // Tipos padrão em caso de erro
        setTipos([
          { idtipo: 1, tipo: 'Perecível' },
          { idtipo: 2, tipo: 'Não perecível' },
          { idtipo: 3, tipo: 'Outros' },
        ]);
      } finally {
        setTiposLoading(false);
      }
    };
    fetchTipos();
  }, []);

  // Função para verificar se tipo é perecível
  const isPerecivel = (tipoId) => {
    const tipo = tipos.find(t => String(t.idtipo) === String(tipoId));
    return tipo && (tipo.tipo?.toLowerCase() === 'perecível' || tipo.tipo?.toLowerCase() === 'perecivel');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.quantidade || formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade é obrigatória e deve ser maior ou igual a zero';
    }

    if (!formData.idtipo) {
      newErrors.idtipo = 'Tipo é obrigatório';
    }

    if (!formData.local.trim()) {
      newErrors.local = 'Localização é obrigatória';
    }

    // Validar validade se tipo for perecível
    if (isPerecivel(formData.idtipo) && !formData.validade) {
      newErrors.validade = 'Validade é obrigatória para produtos perecíveis';
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
      const produtoData = {
        nome: formData.nome,
        codigo: formData.codigo,
        quantidade: parseInt(formData.quantidade),
        validade: isPerecivel(formData.idtipo) ? formData.validade : null,
        local: formData.local,
        idtipo: formData.idtipo === '' ? null : (isNaN(Number(formData.idtipo)) ? formData.idtipo : Number(formData.idtipo)),
        idfornecedor: formData.idfornecedor === '' ? null : (isNaN(Number(formData.idfornecedor)) ? formData.idfornecedor : Number(formData.idfornecedor)),
        entrada: new Date().toISOString().split('T')[0],
      };

      if (mode === 'edit' && produtoEdicao) {
        onSubmit?.(produtoData);
      } else {
        const criado = await produtoService.cadastrar(produtoData);
        onSubmit?.(criado || produtoData);

        // Resetar formulário somente após criação
        setFormData({
          nome: '',
          codigo: '',
          quantidade: '',
          validade: '',
          local: '',
          idtipo: '',
          idfornecedor: '',
        });
      }
    } catch (error) {
      setErrors({ submit: mode === 'edit' ? 'Erro ao atualizar produto. Tente novamente.' : 'Erro ao cadastrar produto. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="cadastro-produto">
      <h2>{mode === 'edit' ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
      
      <form onSubmit={handleSubmit} className="produto-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          {errors.nome && <div className="field-error">{errors.nome}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="codigo">Código *</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade *</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            min="0"
            required
          />
          {errors.quantidade && <div className="field-error">{errors.quantidade}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="idtipo">Tipo *</label>
          <select
            id="idtipo"
            name="idtipo"
            value={formData.idtipo}
            onChange={handleChange}
            required
            disabled={tiposLoading}
          >
            <option value="">
              {tiposLoading ? 'Carregando tipos...' : 'Selecione o tipo'}
            </option>
            {tipos.map(tipo => (
              <option key={tipo.idtipo} value={tipo.idtipo}>
                {tipo.tipo}
              </option>
            ))}
          </select>
          {errors.idtipo && <div className="field-error">{errors.idtipo}</div>}
        </div>

        {/* Campo de validade aparece apenas se tipo for perecível */}
        {isPerecivel(formData.idtipo) && (
          <div className="form-group">
            <label htmlFor="validade">Validade *</label>
            <input
              type="date"
              id="validade"
              name="validade"
              value={formData.validade}
              onChange={handleChange}
              required
            />
            {errors.validade && <div className="field-error">{errors.validade}</div>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="local">Localização *</label>
          <input
            type="text"
            id="local"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
          />
          {errors.local && <div className="field-error">{errors.local}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="idfornecedor">Fornecedor *</label>
          <select
            id="idfornecedor"
            name="idfornecedor"
            value={formData.idfornecedor}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map(f => (
              <option key={f.idfornecedor} value={f.idfornecedor}>{f.nome}</option>
            ))}
          </select>
          {errors.idfornecedor && <div className="field-error">{errors.idfornecedor}</div>}
        </div>

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
            {isLoading ? 'Salvando...' : (mode === 'edit' ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroProduto;