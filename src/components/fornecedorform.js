import React, { useState, useEffect, useRef } from 'react';
import { formatCNPJ, formatPhoneBR } from '../utils/formatters';
import './fornecedorform.css';

//felipe
function isValidCNPJ(value) {
  const digits = String(value || '').replace(/\D/g, '');
  // Validação mínima: 14 dígitos (aceita máscaras como 12.345.678/0001-90)
  return digits.length === 14;
}

export default function FornecedorForm({ onSubmit, initialData = {}, onCancel, mode = 'create', onFormReset }) {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    if (!initialData) return;
    setForm({
      nome: initialData.nome || '',
      cnpj: initialData.cnpj || '',
      email: initialData.email || '',
      telefone: initialData.telefone || '',
    });
    setErrors({});
  }, [initialData]);

  // Expõe método para resetar o formulário
  useEffect(() => {
    if (typeof onFormReset === 'function') {
      onFormReset(() => resetForm());
    }
  }, [onFormReset]);

  const resetForm = () => {
    setForm({
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
    });
    setErrors({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === 'cnpj') next = formatCNPJ(value);
    if (name === 'telefone') next = formatPhoneBR(value);
    setForm((f) => ({ ...f, [name]: next }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'nome é obrigatório';
    if (!form.cnpj.trim()) errs.cnpj = 'cnpj é obrigatório';
    else if (!isValidCNPJ(form.cnpj)) errs.cnpj = 'cnpj inválido';
    if (!form.email.trim()) errs.email = 'email é obrigatório';
    if (!form.telefone.trim()) errs.telefone = 'telefone é obrigatório';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (typeof onSubmit === 'function') {
      onSubmit({
        nome: form.nome.trim(),
        cnpj: form.cnpj.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
      });
    }
  };

  return (
    <form ref={formRef} className="fornecedor-form" onSubmit={handleSubmit} noValidate>
      <h1>{mode === 'edit' ? 'Editar Fornecedor' : 'Fornecedor'}</h1>

      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome da empresa</label>
        <input
          id="nome"
          name="nome"
          type="text"
          className="form-control"
          value={form.nome}
          onChange={handleChange}
        />
        {errors.nome && <div className="text-danger" role="alert">{errors.nome}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="cnpj" className="form-label">CNPJ</label>
        <input
          id="cnpj"
          name="cnpj"
          type="text"
          className="form-control"
          value={form.cnpj}
          onChange={handleChange}
        />
        {errors.cnpj && <div className="text-danger" role="alert">{errors.cnpj}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <div className="text-danger" role="alert">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="telefone" className="form-label">Telefone</label>
        <input
          id="telefone"
          name="telefone"
          type="text"
          className="form-control"
          value={form.telefone}
          onChange={handleChange}
        />
        {errors.telefone && <div className="text-danger" role="alert">{errors.telefone}</div>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Salvar</button>
        {typeof onCancel === 'function' && (
          <button type="button" className="btn btn-cancelar" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
}
