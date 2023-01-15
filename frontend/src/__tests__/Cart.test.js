import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Cart from '../pages/Cart';
import cartReducer from '../redux/slices/cartSlice';

const mockStore = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: {
    cart: {
      items: [
        {
          _id: '1',
          name: 'Test Product',
          price: 99.99,
          quantity: 1
        }
      ],
      total: 99.99
    }
  }
});

describe('Cart Component', () => {
  it('renders cart items', () => {
    render(
      <Provider store={mockStore}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays correct total', () => {
    render(
      <Provider store={mockStore}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText('Total: $99.99')).toBeInTheDocument();
  });
}); 