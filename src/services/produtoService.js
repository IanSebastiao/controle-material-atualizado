import { supabase } from './supabase';

const TABLE = 'produto';

export const produtoService = {
  async cadastrar(produtoData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([produtoData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listar() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('idproduto', { ascending: false });
    if (error) throw error;
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('idproduto', id)
      .single();
    if (error) throw error;
    return data;
  },

  async atualizar(id, produtoData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...produtoData })
      .eq('idproduto', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async excluir(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('idproduto', id);
    if (error) throw error;
    return true;
  },

  async listarTipos() {
    const { data, error } = await supabase
      .from('tipo')
      .select('*')
      .order('tipo', { ascending: true });
    if (error) throw error;
    return data || [];
  }
};