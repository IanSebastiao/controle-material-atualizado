import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
    perfil: 'funcionario',
    cargo: '',
    departamento: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.perfil) {
      newErrors.perfil = 'Perfil é obrigatório';
    }

    if (formData.perfil === 'funcionario') {
      if (!formData.cargo.trim()) {
        newErrors.cargo = 'Cargo é obrigatório para funcionários';
      }
      if (!formData.departamento.trim()) {
        newErrors.departamento = 'Departamento é obrigatório para funcionários';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
        perfil: formData.perfil,
        cargo: formData.perfil === 'funcionario' ? formData.cargo : null,
        departamento: formData.perfil === 'funcionario' ? formData.departamento : null,
      };

      await signUp(userData);
      alert('Conta criada com sucesso! Verifique seu email para confirmar a conta.');
      navigate('/login');
    } catch (error) {
      console.error('Erro no registro:', error);
      setErrors({
        submit: error.message || 'Erro ao criar conta. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Criar Conta</h1>
            <p>Preencha os dados para se registrar no sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
                {errors.nome && <div className="field-error">{errors.nome}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                />
                {errors.telefone && <div className="field-error">{errors.telefone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                required
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Senha *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  required
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  required
                />
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="perfil">Perfil *</label>
              <select
                id="perfil"
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                required
              >
                <option value="funcionario">Funcionário</option>
                <option value="administrador">Administrador</option>
              </select>
              {errors.perfil && <div className="field-error">{errors.perfil}</div>}
            </div>

            {formData.perfil === 'funcionario' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cargo">Cargo *</label>
                  <input
                    type="text"
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    placeholder="Digite seu cargo"
                    required
                  />
                  {errors.cargo && <div className="field-error">{errors.cargo}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="departamento">Departamento *</label>
                  <input
                    type="text"
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    placeholder="Digite seu departamento"
                    required
                  />
                  {errors.departamento && <div className="field-error">{errors.departamento}</div>}
                </div>
              </div>
            )}

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <button
              type="submit"
              className="btn-register"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="register-footer">
            <p>Já tem uma conta? <Link to="/login">Fazer login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;