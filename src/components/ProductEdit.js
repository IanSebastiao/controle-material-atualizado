import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProductEdit = ({ product = {}, onSubmit, onCancel, mode = 'edit' }) => {
  const [form, setForm] = useState({
    id: product.id ?? null,
    nome: product.nome ?? '',
    codigo: product.codigo ?? '',
    quantidade: product.quantidade != null ? String(product.quantidade) : '',
    fornecedor: product.fornecedor ?? '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      id: product.id ?? null,
      nome: product.nome ?? '',
      codigo: product.codigo ?? '',
      quantidade: product.quantidade != null ? String(product.quantidade) : '',
      fornecedor: product.fornecedor ?? '',
    });
    setErrors({});
  }, [product]);

  const validate = () => {
    const err = {};
    if (!form.nome || form.nome.trim() === '') err.nome = 'Nome é obrigatório';
    if (!form.codigo || form.codigo.trim() === '') err.codigo = 'Código é obrigatório';
    if (form.quantidade !== '' && Number.isNaN(Number(form.quantidade))) err.quantidade = 'Quantidade deve ser numérica';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      quantidade: form.quantidade === '' ? null : Number(form.quantidade),
    };
    if (typeof onSubmit === 'function') onSubmit(payload);
  };

  return (
    <div className="product-edit">
      <h2>{mode === 'edit' ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
      <form onSubmit={submit} aria-label="product-form">
        <div>
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="codigo">Código</label>
          <input id="codigo" name="codigo" value={form.codigo} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input id="quantidade" name="quantidade" value={form.quantidade} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="fornecedor">Fornecedor</label>
          <input id="fornecedor" name="fornecedor" value={form.fornecedor} onChange={handleChange} />
        </div>

        {Object.keys(errors).length > 0 && (
          <div role="alert" style={{ color: 'red', marginTop: 8 }}>
            {Object.values(errors).join(' - ')}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button type="submit">{mode === 'edit' ? 'Salvar' : 'Cadastrar'}</button>
          <button type="button" onClick={() => typeof onCancel === 'function' && onCancel()} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

ProductEdit.propTypes = {
  product: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  mode: PropTypes.oneOf(['edit', 'create']),
};

export default ProductEdit;