import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CadastroUsuario from '../components/CadastroUsuario';
import { supabase } from '../supabaseClient';

// Mock do supabase
jest.mock('../supabaseClient');

describe('Componente CadastroUsuario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o formulário com campos obrigatórios', () => {
    render(<CadastroUsuario />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  test('deve submeter o formulário com dados válidos', async () => {
    const mockUserData = {
      nome: 'João Silva',
      email: 'joao@example.com'
    };

    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null })
    });

    render(<CadastroUsuario />);

    await userEvent.type(screen.getByLabelText(/nome/i), mockUserData.nome);
    await userEvent.type(screen.getByLabelText(/email/i), mockUserData.email);

    const cadastrarButton = screen.getByRole('button', { name: /cadastrar/i });
    await userEvent.click(cadastrarButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(supabase.from('users').insert).toHaveBeenCalledWith([{ nome: mockUserData.nome, email: mockUserData.email }]);
      expect(screen.getByText(/usuário cadastrado com sucesso/i)).toBeInTheDocument();
    });
  });

  test('deve mostrar erro ao falhar no cadastro', async () => {
    const mockUserData = {
      nome: 'João Silva',
      email: 'joao@example.com'
    };

    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: { message: 'Erro ao cadastrar' } })
    });

    render(<CadastroUsuario />);

    await userEvent.type(screen.getByLabelText(/nome/i), mockUserData.nome);
    await userEvent.type(screen.getByLabelText(/email/i), mockUserData.email);

    const cadastrarButton = screen.getByRole('button', { name: /cadastrar/i });
    await userEvent.click(cadastrarButton);

    await waitFor(() => {
      expect(screen.getByText(/erro ao cadastrar/i)).toBeInTheDocument();
    });
  });
});

