import { supabase } from './supabase';

const TABLE = 'movimentacoes';

export const movimentacaoService = {
    async registrar(movimentacaoData) {
        const { data, error } = await supabase
            .from(TABLE)
            .insert([{ ...movimentacaoData, dataRegistro: new Date().toISOString() }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async atualizar(id, movimentacaoData) {
        const { data, error } = await supabase
            .from(TABLE)
            .update({ ...movimentacaoData })
            .eq('id', id)
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

    async listarPorProduto(produtoId) {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('produtoId', produtoId)
            .order('id', { ascending: false });
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
