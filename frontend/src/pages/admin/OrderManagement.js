import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.view ? '#007bff' : '#28a745'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'paid') return order.isPaid;
    if (filter === 'unpaid') return !order.isPaid;
    return true;
  });

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h2>Order Management</h2>
      
      <FilterSection>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="paid">Paid Orders</option>
          <option value="unpaid">Unpaid Orders</option>
        </Select>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Customer</Th>
            <Th>Date</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.user.name}</Td>
              <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
              <Td>${order.totalPrice}</Td>
              <Td>{order.isPaid ? 'Paid' : 'Pending'}</Td>
              <Td>
                <Button view onClick={() => setSelectedOrder(order)}>
                  View Details
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <Modal>
          <ModalContent>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.user.name}</p>
            <p><strong>Email:</strong> {selectedOrder.user.email}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
            
            <h4>Shipping Address</h4>
            <p>{selectedOrder.shippingAddress.address}</p>
            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
            <p>{selectedOrder.shippingAddress.country}</p>

            <h4>Items</h4>
            {selectedOrder.orderItems.map((item) => (
              <div key={item._id} style={{ marginBottom: '1rem' }}>
                <p>{item.name} x {item.quantity}</p>
                <p>${item.price} each</p>
              </div>
            ))}

            <div style={{ marginTop: '2rem' }}>
              <Button
                onClick={() => handleUpdateStatus(selectedOrder._id, !selectedOrder.isPaid)}
              >
                Mark as {selectedOrder.isPaid ? 'Unpaid' : 'Paid'}
              </Button>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default OrderManagement; 