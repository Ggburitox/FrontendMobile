import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const IP = 't9phfqs-anonymous-8081.exp.direct';
const BACKEND_URL = 'http://' + IP + ':8080'; // Spring Boot

export const register = async (body) => {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, body);
    return response.data;
};

export const login = async (body) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, body);
      const token = response.data.token;
      await SecureStore.setItemAsync('token', token);
      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
};