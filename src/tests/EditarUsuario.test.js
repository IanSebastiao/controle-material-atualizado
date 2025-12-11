import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditarUsuario from '../components/EditarUsuario';
import { usuarioService } from '../services/usuarioService';

// Mock do usuarioService
jest.mock('../services/usuarioService');

describe('EditarUsuario', () => {
  const sampleUser = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza campos com valores iniciais do usuário', async () => {
    usuarioService.buscarPorId.mockResolvedValue(sampleUser);

    render(<EditarUsuario userId={1} onSubmit={jest.fn()} onCancel={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toHaveValue('João Silva');
      expect(screen.getByLabelText(/email/i)).toHaveValue('joao@example.com');
    });
  });

  test('submete dados atualizados ao clicar em salvar', async () => {
    usuarioService.buscarPorId.mockResolvedValue(sampleUser);
    const onSubmit = jest.fn();

    render(<EditarUsuario userId={1} onSubmit={onSubmit} onCancel={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toHaveValue('João Silva');
    });

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.clear(nomeInput);
    await userEvent.type(nomeInput, 'João Santos');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'joao.santos@example.com');

    const salvarButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(salvarButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        nome: 'João Santos',
        email: 'joao.santos@example.com',
      });
    });
  });

  test('validação: mostra erro quando nome ou email vazios e não submete', async () => {
    usuarioService.buscarPorId.mockResolvedValue(sampleUser);
    const onSubmit = jest.fn();

    render(<EditarUsuario userId={1} onSubmit={onSubmit} onCancel={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toHaveValue('João Silva');
    });

    const nomeInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);

    await userEvent.clear(nomeInput);
    await userEvent.clear(emailInput);

    const salvarButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(salvarButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  test('botão cancelar chama onCancel', async () => {
    usuarioService.buscarPorId.mockResolvedValue(sampleUser);
    const onCancel = jest.fn();

    render(<EditarUsuario userId={1} onSubmit={jest.fn()} onCancel={onCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome/i)).toHaveValue('João Silva');
    });

    const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelarButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('mostra erro se falhar ao buscar usuário', async () => {
    usuarioService.buscarPorId.mockRejectedValue(new Error('Usuário não encontrado'));

    render(<EditarUsuario userId={1} onSubmit={jest.fn()} onCancel={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar usuário/i)).toBeInTheDocument();
    });
  });
});
