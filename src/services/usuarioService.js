import { supabase } from './supabase';

const TABLE = 'users';

export const usuarioService = {
  async cadastrar(usuarioData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([usuarioData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listar() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async atualizar(id, usuarioData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...usuarioData })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async excluir(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
