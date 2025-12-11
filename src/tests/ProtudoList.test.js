import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';

describe('ProductList', () => {
  const products = [
    { id: 1, nome: 'Parafuso', codigo: 'P001', quantidade: 100 },
    { id: 2, nome: 'Porca', codigo: 'P002', quantidade: 50 },
  ];

  test('renderiza cabeçalho e produtos', () => {
    render(<ProductList products={products} />);
    expect(screen.getByText('Listagem de Produtos')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Quantidade')).toBeInTheDocument();

    expect(screen.getByText('Parafuso')).toBeInTheDocument();
    expect(screen.getByText('Porca')).toBeInTheDocument();
    expect(screen.getByText('P001')).toBeInTheDocument();
  });

  test('mostra mensagem quando não há produtos', () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument();
  });

  test('filtra produtos pelo input de pesquisa (nome ou código)', () => {
    render(<ProductList products={products} />);
    const input = screen.getByPlaceholderText('Pesquisar por nome ou código');

    fireEvent.change(input, { target: { value: 'paraf' } });
    expect(screen.getByText('Parafuso')).toBeInTheDocument();
    expect(screen.queryByText('Porca')).toBeNull();

    fireEvent.change(input, { target: { value: 'P002' } });
    expect(screen.getByText('Porca')).toBeInTheDocument();
    expect(screen.queryByText('Parafuso')).toBeNull();
  });

  test('chama onDelete e remove produto quando confirmação é positiva', async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<ProductList products={products} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).toHaveBeenCalledWith(products[0]);

    await waitFor(() => {
      expect(screen.queryByText('Parafuso')).toBeNull();
    });

    window.confirm.mockRestore();
  });

  test('não remove produto quando usuário cancela confirmação', async () => {
    const onDelete = jest.fn();
    jest.spyOn(window, 'confirm').mockImplementation(() => false);

    render(<ProductList products={products} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).not.toHaveBeenCalled();
    // produto permanece
    expect(screen.getByText('Parafuso')).toBeInTheDocument();

    window.confirm.mockRestore();
  });

  test('não remove produto se onDelete retornar false', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const onDelete = jest.fn(() => false);

    render(<ProductList products={products} onDelete={onDelete} />);

    const delBtn = screen.getByLabelText('delete-1');
    fireEvent.click(delBtn);

    expect(onDelete).toHaveBeenCalledWith(products[0]);
    // remoção local é abortada quando onDelete retorna false
    expect(screen.getByText('Parafuso')).toBeInTheDocument();

    window.confirm.mockRestore();
  });
});