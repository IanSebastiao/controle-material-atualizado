import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usuarioService } from '../services/usuarioService';

const EditarUsuario = ({ userId, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    nome: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await usuarioService.buscarPorId(userId);
        setForm({
          nome: user.nome || '',
          email: user.email || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar usuário');
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  const validate = () => {
    const err = {};
    if (!form.nome || form.nome.trim() === '') err.nome = 'Nome é obrigatório';
    if (!form.email || form.email.trim() === '') err.email = 'Email é obrigatório';
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
    if (typeof onSubmit === 'function') onSubmit(form);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="editar-usuario">
      <h2>Editar Usuário</h2>
      <form onSubmit={submit} aria-label="usuario-form">
        <div>
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        {Object.keys(errors).length > 0 && (
          <div role="alert" style={{ color: 'red', marginTop: 8 }}>
            {Object.values(errors).join(' - ')}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => typeof onCancel === 'function' && onCancel()} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

EditarUsuario.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default EditarUsuario;
