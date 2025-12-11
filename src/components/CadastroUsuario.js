import { useState } from 'react';
import { supabase } from '../supabaseClient';

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('users')
      .insert([{ nome, email }]);
    if (error) setMensagem('Erro ao cadastrar');
    else setMensagem('Usuário cadastrado com sucesso');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome <input value={nome} onChange={e => setNome(e.target.value)} /></label>
      <label>Email <input value={email} onChange={e => setEmail(e.target.value)} /></label>
      <button type="submit">Cadastrar</button>
      {mensagem && <div>{mensagem}</div>}
    </form>
  );
}

export default CadastroUsuario;
