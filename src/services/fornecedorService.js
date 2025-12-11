import { supabase } from './supabase';
import { stripNonDigits } from '../utils/formatters';

const SCHEMA = process.env.REACT_APP_SUPABASE_SCHEMA || 'public';
// Tabela real no seu schema está como 'fornecedor' (singular)
const TABLE = process.env.REACT_APP_FORNECEDORES_TABLE_NAME || 'fornecedor';
// PK real na sua tabela: idfornecedor
const PK = process.env.REACT_APP_FORNECEDOR_PK || 'idfornecedor';

const table = () => supabase.schema(SCHEMA).from(TABLE);

// Implementação baseada no serviço de cursos (TDD-friendly)
export const addFornecedor = async (fornecedor) => {
  const payload = {
    nome: fornecedor?.nome?.trim(),
    cnpj: stripNonDigits(fornecedor?.cnpj),
    email: fornecedor?.email?.trim(),
    telefone: stripNonDigits(fornecedor?.telefone),
    ...(fornecedor?.endereco != null && { endereco: String(fornecedor.endereco).trim() }),
  };
  const { data, error } = await table()
    .insert([payload])
    .select('*');
  if (error) throw error;
  return data?.[0];
};

export const getFornecedores = async () => {
  const { data, error } = await table()
    .select('*')
    .order('nome', { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const updateFornecedor = async (id, changes) => {
  const payload = {};
  if (changes?.nome != null) payload.nome = String(changes.nome).trim();
  if (changes?.cnpj != null) payload.cnpj = stripNonDigits(changes.cnpj);
  if (changes?.email != null) payload.email = String(changes.email).trim();
  if (changes?.telefone != null) payload.telefone = stripNonDigits(changes.telefone);
  if (changes?.endereco != null) payload.endereco = String(changes.endereco).trim();

  const { data, error } = await table()
    .update(payload)
    .eq(PK, id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

export const deleteFornecedor = async (id) => {
  const { error } = await table()
    .delete()
    .eq(PK, id);
  if (error) throw error;
  return true;
};
