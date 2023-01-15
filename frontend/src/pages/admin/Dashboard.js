import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled(Link)`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <h2>Admin Dashboard</h2>
      <Grid>
        <Card to="/admin/products">
          <h3>Products</h3>
          <p>Manage your product inventory</p>
        </Card>
        <Card to="/admin/orders">
          <h3>Orders</h3>
          <p>View and manage customer orders</p>
        </Card>
        <Card to="/admin/users">
          <h3>Users</h3>
          <p>Manage user accounts</p>
        </Card>
        <Card to="/admin/analytics">
          <h3>Analytics</h3>
          <p>View sales and performance metrics</p>
        </Card>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard; 