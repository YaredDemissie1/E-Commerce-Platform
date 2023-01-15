import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 1rem;
`;

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: ''
  });
  const [message, setMessage] = useState({ error: null, success: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email
        }));
      } catch (error) {
        setMessage({ error: 'Failed to fetch user data' });
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          name: userData.name,
          email: userData.email,
          password: userData.newPassword,
          currentPassword: userData.password
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ success: 'Profile updated successfully' });
      setUserData(prev => ({
        ...prev,
        password: '',
        newPassword: ''
      }));
    } catch (error) {
      setMessage({ error: error.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <Container>
      <h2>User Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Current Password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        />
        <Input
          type="password"
          placeholder="New Password (optional)"
          value={userData.newPassword}
          onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
        />
        <Button type="submit">Update Profile</Button>
        
        {message.error && <ErrorMessage>{message.error}</ErrorMessage>}
        {message.success && <SuccessMessage>{message.success}</SuccessMessage>}
      </Form>
    </Container>
  );
};

export default Profile; 