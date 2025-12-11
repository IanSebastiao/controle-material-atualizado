import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// TDD: o componente ainda não existe. Este teste descreve o contrato esperado.
import FornecedorForm from '../components/fornecedorform';

describe('FornecedorForm (TDD - RED)', () => {
  test('renderiza campos essenciais e botão de salvar', () => {
    const handleSubmit = jest.fn();
    render(<FornecedorForm onSubmit={handleSubmit} />);

    // Contrato mínimo de UI
    expect(
      screen.getByRole('heading', { name: /fornecedor/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /salvar/i })
    ).toBeInTheDocument();
  });

  test('envia dados válidos chamando onSubmit com o payload esperado', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<FornecedorForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/nome da empresa/i), 'Fornecedor X');
    await user.type(screen.getByLabelText(/cnpj/i), '12.345.678/0001-90');
    await user.type(screen.getByLabelText(/email/i), 'contato@fornecedorx.com');
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-0000');

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      nome: 'Fornecedor X',
      cnpj: '12.345.678/0001-90',
      email: 'contato@fornecedorx.com',
      telefone: '(11) 99999-0000',
    });
  });

  test('mostra erros de validação quando campos obrigatórios estão vazios', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<FornecedorForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Mensagens de erro esperadas no contrato
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/cnpj é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/telefone é obrigatório/i)).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('valida CNPJ inválido', async () => {
    const user = userEvent.setup();
    render(<FornecedorForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText(/cnpj/i), '123');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(screen.getByText(/cnpj inválido/i)).toBeInTheDocument();
  });
});
