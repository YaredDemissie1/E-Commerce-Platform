import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import styled from 'styled-components';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
  }
`;

const CardContainer = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
`;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total } = useSelector(state => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/payment/create-payment-intent',
          { amount: total },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to initialize payment');
      }
    };

    if (total > 0) {
      getClientSecret();
    }
  }, [total]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Create order in database
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payment/create-order',
        {
          orderItems: items,
          shippingAddress,
          totalPrice: total,
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear cart and redirect to success page
      // You'll need to implement these functions
      // dispatch(clearCart());
      // navigate('/order-success');
    } catch (error) {
      console.error('Error:', error);
      setError('Payment failed');
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Shipping Address</h3>
      <Input
        type="text"
        placeholder="Address"
        value={shippingAddress.address}
        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="City"
        value={shippingAddress.city}
        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="Postal Code"
        value={shippingAddress.postalCode}
        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
        required
      />
      <Input
        type="text"
        placeholder="Country"
        value={shippingAddress.country}
        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
        required
      />

      <h3>Payment Information</h3>
      <CardContainer>
        <CardElement />
      </CardContainer>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${total}`}
      </Button>
    </Form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContainer>
        <h2>Checkout</h2>
        <CheckoutForm />
      </CheckoutContainer>
    </Elements>
  );
};

export default Checkout; 