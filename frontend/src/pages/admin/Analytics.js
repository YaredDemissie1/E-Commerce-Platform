import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
`;

const Analytics = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0
  });
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { stats: analyticsStats, salesByDate } = response.data;

      setStats(analyticsStats);
      
      // Prepare data for the chart
      setSalesData({
        labels: salesByDate.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Daily Sales ($)',
            data: salesByDate.map(item => item.total),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h2>Analytics Dashboard</h2>
      <Grid>
        <Card>
          <h3>Total Sales</h3>
          <p>${stats.totalSales.toFixed(2)}</p>
        </Card>
        <Card>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </Card>
        <Card>
          <h3>Average Order Value</h3>
          <p>${stats.averageOrderValue.toFixed(2)}</p>
        </Card>
        <Card>
          <h3>Total Customers</h3>
          <p>{stats.totalCustomers}</p>
        </Card>
      </Grid>

      <ChartContainer>
        <h3>Sales Trend</h3>
        <Line 
          data={salesData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Daily Sales'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </ChartContainer>
    </Container>
  );
};

export default Analytics; 