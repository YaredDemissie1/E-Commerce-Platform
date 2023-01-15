import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from '../pages/Products';
import axios from 'axios';

jest.mock('axios');

const mockProducts = [
  {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
    category: 'Electronics'
  }
];

describe('Products Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/categories')) {
        return Promise.resolve({ data: ['Electronics', 'Clothing'] });
      }
      return Promise.resolve({ data: mockProducts });
    });
  });

  it('renders products list', async () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });

  it('filters products by search', async () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search products...');
      fireEvent.change(searchInput, { target: { value: 'Test' } });
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
}); 