import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UsuarioList from '../components/UsuarioList';

describe('UsuarioList', () => {
  const usuarios = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com' },
  ];

  test('renderiza cabeçalho e usuários', () => {
    render(<UsuarioList usuarios={usuarios} />);
    expect(screen.getByText('Listagem de Usuários')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  test('mostra mensagem quando não há usuários', () => {
    render(<UsuarioList usuarios={[]} />);
    expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
  });

  test('filtra usuários pelo input de pesquisa (nome ou email)', () => {
    render(<UsuarioList usuarios={usuarios} />);
    const input = screen.getByPlaceholderText('Pesquisar por nome ou email');

    fireEvent.change(input, { target: { value: 'joão' } });
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.queryByText('Maria Santos')).toBeNull();

    fireEvent.change(input, { target: { value: 'maria@example.com' } });
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.queryByText('João Silva')).toBeNull();
  });

  test('chama onDelete e remove usuário quando confirmação é positiva', async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<UsuarioList usuarios={usuarios} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).toHaveBeenCalledWith(usuarios[0]);

    await waitFor(() => {
      expect(screen.queryByText('João Silva')).toBeNull();
    });

    window.confirm.mockRestore();
  });

  test('não remove usuário quando usuário cancela confirmação', async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, 'confirm').mockImplementation(() => false);

    render(<UsuarioList usuarios={usuarios} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).not.toHaveBeenCalled();
    // usuário permanece
    expect(screen.getByText('João Silva')).toBeInTheDocument();

    window.confirm.mockRestore();
  });

  test('não remove usuário se onDelete retornar false', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const onDelete = jest.fn(() => false);

    render(<UsuarioList usuarios={usuarios} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).toHaveBeenCalledWith(usuarios[0]);
    // remoção local é abortada quando onDelete retorna false
    expect(screen.getByText('João Silva')).toBeInTheDocument();

    window.confirm.mockRestore();
  });
});
