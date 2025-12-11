import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductEdit from '../components/ProductEdit';

describe('ProductEdit', () => {
  const sampleProduct = {
    id: 1,
    nome: 'Parafuso',
    codigo: 'P001',
    quantidade: 100,
    fornecedor: 'Fornecedor A',
  };

  test('renderiza campos com valores iniciais', () => {
    render(<ProductEdit product={sampleProduct} />);
    expect(screen.getByLabelText('Nome').value).toBe('Parafuso');
    expect(screen.getByLabelText('Código').value).toBe('P001');
    expect(screen.getByLabelText('Quantidade').value).toBe('100');
    expect(screen.getByLabelText('Fornecedor').value).toBe('Fornecedor A');
    expect(screen.getByRole('button', { name: /Salvar|Cadastrar/ })).toBeInTheDocument();
  });

  test('submete dados atualizados ao clicar em salvar', () => {
    const onSubmit = jest.fn();
    render(<ProductEdit product={sampleProduct} onSubmit={onSubmit} />);
    const nomeInput = screen.getByLabelText('Nome');
    const quantidadeInput = screen.getByLabelText('Quantidade');

    fireEvent.change(nomeInput, { target: { value: 'Parafuso Grande' } });
    fireEvent.change(quantidadeInput, { target: { value: '150' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar|Cadastrar/ }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      nome: 'Parafuso Grande',
      codigo: 'P001',
      quantidade: 150,
      fornecedor: 'Fornecedor A',
    }));
  });

  test('validação: mostra erro quando nome ou código vazios e não submete', () => {
    const onSubmit = jest.fn();
    render(<ProductEdit product={sampleProduct} onSubmit={onSubmit} />);
    const nomeInput = screen.getByLabelText('Nome');
    const codigoInput = screen.getByLabelText('Código');

    fireEvent.change(nomeInput, { target: { value: '' } });
    fireEvent.change(codigoInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar|Cadastrar/ }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('botão cancelar chama onCancel', () => {
    const onCancel = jest.fn();
    render(<ProductEdit product={sampleProduct} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/ }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});