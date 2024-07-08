import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = '10.0.2.2'; // Use this IP para conectar a localhost desde el emulador de Android
const BACKEND_URL = `http://${IP}:8080`;

export const register = async (body) => {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, body);
    return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
  console.log("Login response:", response.data);
  await SecureStore.setItemAsync('token', response.data.token); // Almacenar token en SecureStore
  await AsyncStorage.setItem('token', response.data.token); // Almacenar token en AsyncStorage
  return response.data;
};

export const getPassenger = async () => {
    let token = await SecureStore.getItemAsync('token');
    if (!token) {
        token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
    }
    console.log("Token being used:", token);
    const response = await axios.get(`${BACKEND_URL}/passenger/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
}

export const updatePassenger = async (passengerData) => {
  let token = await SecureStore.getItemAsync('token');
  if (!token) {
      token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
  }
  return await axios.put(`${BACKEND_URL}/passenger/me`, passengerData, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  }).then(response => {
      return response.data;
  }).catch(error => {
      throw error;
  });
}

export const deletePassenger = async () => {
  let token = await SecureStore.getItemAsync('token');
  if (!token) {
      token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
  }
  return await axios.delete(`${BACKEND_URL}/passenger/me`, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  }).then(response => {
      return response.data;
  }).catch(error => {
      throw error;
  });
}

export const getCurrentStationBuses = async () => {
  let token = await SecureStore.getItemAsync('token');
  if (!token) {
      token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
  }
  const response = await axios.get(`${BACKEND_URL}/station/current/buses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export const updatePassengerStation = async (stationData) => {
  let token = await SecureStore.getItemAsync('token');
  if (!token) {
      token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
  }
  return await axios.patch(`${BACKEND_URL}/passenger/me/station`, stationData, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  }).then(response => {
      return response.data;
  }).catch(error => {
      throw error;
  });
}

export const getCurrentPassengerStation = async () => {
  let token = await SecureStore.getItemAsync('token');
  if (!token) {
      token = await AsyncStorage.getItem('token'); // Fallback a AsyncStorage si SecureStore falla
  }
  const response = await axios.get(`${BACKEND_URL}/passenger/me/station`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}
