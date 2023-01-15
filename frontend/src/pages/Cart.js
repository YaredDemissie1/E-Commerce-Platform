import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../redux/slices/cartSlice';
import styled from 'styled-components';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.checkout ? '#28a745' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.checkout ? '#218838' : '#c82333'};
  }
`;

const Cart = () => {
  const { items, total } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <CartContainer>
        <h2>Your cart is empty</h2>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <CartItem key={item._id}>
          <ItemImage src={item.image} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
          <p>${item.price}</p>
          <Button onClick={() => handleRemoveItem(item)}>Remove</Button>
        </CartItem>
      ))}
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <h3>Total: ${total}</h3>
        <Button checkout onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </CartContainer>
  );
};

export default Cart; 