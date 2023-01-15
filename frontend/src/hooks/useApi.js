import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  }, []);

  return { loading, error, request };
};

export default useApi; 