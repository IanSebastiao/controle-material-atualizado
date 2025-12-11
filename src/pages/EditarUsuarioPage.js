import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import EditarUsuario from '../components/EditarUsuario';

const EditarUsuarioPage = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const encontrado = await usuarioService.buscarPorId(id);
        setUsuario(encontrado);
      } catch (e) {
        setErro('Erro ao carregar usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleSubmit = async (dadosEditados) => {
    try {
      await usuarioService.atualizar(id, dadosEditados);
      setMensagem('Usuário atualizado com sucesso!');
      setTimeout(() => {
        setMensagem('');
        navigate('/usuarios'); // Assumindo que há uma rota /usuarios para listar usuários
      }, 1500);
    } catch {
      setErro('Erro ao salvar alterações.');
    }
  };

  if (loading) return <p>Carregando usuário...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="editar-usuario-page">
      <div className="page-container">
        <h1>Editar Usuário</h1>
        {mensagem && (
          <div className="alert alert-success">
            {mensagem}
          </div>
        )}
        <EditarUsuario
          userId={id}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/usuarios')}
        />
      </div>
    </div>
  );
};

export default EditarUsuarioPage;
