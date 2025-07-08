import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductCatalog from './ProductCatalog'; // adjust path as needed

// Mock components
jest.mock('./components/Card', () => ({ children, onClick }) => (
  <div data-testid="card" onClick={onClick}>{children}</div>
));
jest.mock('./components/Button', () => ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
));
jest.mock('./components/Input', () => ({ name, value, onChange, placeholder }) => (
  <input name={name} value={value} onChange={onChange} placeholder={placeholder} />
));
jest.mock('./components/Dialog', () => ({ children }) => <div>{children}</div>);

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          product_name: 'Crowe Test Product',
          brand: 'Crowe Test Brand',
          price: 0.01,
          model: 'Not professionally',
          product_description: 'Overpriced, but worth it',
          product_key: '001100101',
          retailer: 'Crowe Test Retailer'
        }
      ])
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ProductCatalog', () => {
  test('renders product list from fetch', async () => {
    render(<ProductCatalog />);

    expect(await screen.findByText('Crowe Test Product')).toBeInTheDocument();
    expect(screen.getByText('Brand: Crowe Test Brand')).toBeInTheDocument();
  });

  test('expands product details on card click', async () => {
    render(<ProductCatalog />);
    const card = await screen.findByTestId('card');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Description:/)).toBeInTheDocument();
      expect(screen.getByText(/Retailer:/)).toBeInTheDocument();
    });
  });
});
