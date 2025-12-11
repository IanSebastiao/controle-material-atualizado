import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovimentacaoForm from '../components/MovimentacaoForm';
import { movimentacaoService } from '../services/movimentacaoService';
import { produtoService } from '../services/produtoService';

// Mock dos serviços
jest.mock('../services/movimentacaoService');
jest.mock('../services/produtoService');

describe('Componente MovimentacaoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mocka produtos para não travar no carregando
    produtoService.listar.mockResolvedValue([
      { id: '1', name: 'Produto Teste', quantidade: 100 },
      { id: '2', name: 'Produto 2', quantidade: 50 }
    ]);
  });

  test('deve renderizar o formulário com campos obrigatórios', async () => {
    render(<MovimentacaoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    // Aguarda o carregamento dos produtos
    await waitFor(() => expect(screen.queryByText(/carregando produtos/i)).not.toBeInTheDocument());
    expect(screen.getByLabelText(/tipo de movimentação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data da movimentação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/responsável/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    render(<MovimentacaoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await waitFor(() => expect(screen.queryByText(/carregando produtos/i)).not.toBeInTheDocument());
  const salvarButton = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(screen.getByText(/produto é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/quantidade é obrigatória e deve ser maior que zero/i)).toBeInTheDocument();
      expect(screen.getByText(/responsável é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('deve submeter o formulário com dados válidos para entrada', async () => {
    const mockMovimentacaoData = {
      tipo: 'entrada',
      produtoId: '1',
      quantidade: '10',
      data: '2024-01-15',
      responsavel: 'João Silva',
      observacao: 'Compra mensal'
    };

    movimentacaoService.registrar.mockResolvedValue({ success: true });

    render(<MovimentacaoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await waitFor(() => expect(screen.queryByText(/carregando produtos/i)).not.toBeInTheDocument());
    // Preenche o formulário
    await userEvent.selectOptions(screen.getByLabelText(/tipo de movimentação/i), 'entrada');
    await userEvent.selectOptions(screen.getByLabelText(/produto/i), '1');
    await userEvent.type(screen.getByLabelText(/quantidade/i), '10');
    // Preenche o campo data se estiver vazio
    const dataInput = screen.getByLabelText(/data da movimentação/i);
    if (!dataInput.value) {
      await userEvent.type(dataInput, '2024-01-15');
    }
    await userEvent.type(screen.getByLabelText(/responsável/i), 'João Silva');
    await userEvent.type(screen.getByLabelText(/observação/i), 'Compra mensal');

  const salvarButton = screen.getByRole('button', { name: /registrar/i });
    await userEvent.click(salvarButton);

    await waitFor(() => {
      expect(movimentacaoService.registrar).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: 'entrada',
          produtoId: '1',
          quantidade: 10,
          responsavel: 'João Silva'
        })
      );
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('deve validar quantidade positiva para entrada e negativa para saída', async () => {
    render(<MovimentacaoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await waitFor(() => expect(screen.queryByText(/carregando produtos/i)).not.toBeInTheDocument());
    // Teste para entrada
    await userEvent.selectOptions(screen.getByLabelText(/tipo de movimentação/i), 'entrada');
  await userEvent.type(screen.getByLabelText(/quantidade/i), '-5');
    
  const salvarButton = screen.getByRole('button', { name: /registrar/i });
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(screen.getByText(/quantidade é obrigatória e deve ser maior que zero/i)).toBeInTheDocument();
    });

    // Teste para saída
    await userEvent.selectOptions(screen.getByLabelText(/tipo de movimentação/i), 'saida');
  await userEvent.type(screen.getByLabelText(/quantidade/i), '5');
    
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(screen.getByText(/quantidade é obrigatória e deve ser maior que zero/i)).toBeInTheDocument();
    });
  });

  test('deve chamar onCancel ao clicar em cancelar', async () => {
    render(<MovimentacaoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await waitFor(() => expect(screen.queryByText(/carregando produtos/i)).not.toBeInTheDocument());
    const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelarButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});