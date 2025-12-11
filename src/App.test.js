

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Sistema de Controle de Estoque/i);
  expect(titleElement).toBeInTheDocument();
});
