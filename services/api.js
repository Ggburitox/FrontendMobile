import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = '10.0.2.2'; 
const BACKEND_URL = `http://${IP}:8080`;

export const register = async (body) => {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, body);
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
    console.log("Login response:", response.data);
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
};

export const getPassenger = async () => {
    let token = await AsyncStorage.getItem('token');
    console.log("Token being used:", token);
    const response = await axios.get(`${BACKEND_URL}/passenger/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const updatePassenger = async (passengerData) => {
    let token = await AsyncStorage.getItem('token');
    return await axios.put(`${BACKEND_URL}/passenger/me`, passengerData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data;
    }).catch(error => {
        throw error;
    });
};

export const deletePassenger = async () => {
    try {
        let token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.delete(`${BACKEND_URL}/passenger/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to delete passenger', error);
        throw error;
    }
};

export const getCurrentStationBuses = async () => {
    let token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BACKEND_URL}/station/current/buses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (Array.isArray(response.data)) {
        return response.data;
    } else {
        console.error('Unexpected response format:', response.data);
        return [];
    }
};

export const updatePassengerStation = async (stationData) => {
    let token = await AsyncStorage.getItem('token');
    return await axios.patch(`${BACKEND_URL}/passenger/me/station`, stationData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.data;
    }).catch(error => {
        throw error;
    });
};

export const getCurrentPassengerStation = async () => {
    let token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BACKEND_URL}/passenger/me/station`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};
