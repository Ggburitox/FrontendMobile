import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const IP = 't9phfqs-anonymous-8081.exp.direct'; // usar la ip que te da expo
const BACKEND_URL = 'http://' + IP + ':8080';

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

export const getPassenger = async () => {
    const token = await SecureStore.getItemAsync('token');
    const response = await axios.get(`${BACKEND_URL}/passenger`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
}

export const updatePassenger = async (passengerData) => {
  return await axios.put(BACKEND_URL + '/passenger/me', passengerData, {
      headers: {
          'Authorization': 'Bearer ' + await SecureStore.getItemAsync('token')
      }
  }).then(response => {
      return response.data;
  }).catch(error => {
      throw error;
  });
}

export const deletePassenger = async () => {
  return await axios.delete(BACKEND_URL + '/passenger/me', {
      headers: {
          'Authorization': 'Bearer ' + await SecureStore.getItemAsync('token')
      }
  }).then(response => {
      return response.data;
  }).catch(error => {
      throw error;
  });
}

export const updatePassengerStation = async (stationDto) => {
  try {
    const response = await axios.patch(`${BASE_URL}/me/station`, stationDto);
    return response.data;
  } catch (error) {
    console.error('Error updating passenger station:', error);
    throw error;
  }
};

// Function to get current station buses
export const getCurrentStationBuses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/current/buses`);
    return response.data; // Assuming the backend returns an array of BusDto objects
  } catch (error) {
    console.error('Error getting current station buses:', error);
    throw error;
  }
};

export const getCurrentPassengerStation = async () => {
  try {
    const response = await api.get('/me/station');
    return response.data; // Assuming the server responds with the station data directly
  } catch (error) {
    // Handle error appropriately
    console.error('Error fetching current passenger station:', error);
    throw error; // Re-throw or handle as needed
  }
};
    