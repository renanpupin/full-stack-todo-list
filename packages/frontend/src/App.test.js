import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders components', () => {
  const { getByText, getByTestId } = render(<App />);

  const titleElement = getByText(/TODOs/i);
  expect(titleElement).toBeInTheDocument();

  const listElement = getByTestId('list-todos');
  expect(listElement).toBeInTheDocument();

  const inputElement = getByTestId('input-todo');
  expect(inputElement).toBeInTheDocument();

  const buttonElement = getByTestId('submit-todo');
  expect(buttonElement).toBeInTheDocument();

});
