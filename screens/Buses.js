import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList } from 'react-native';
import { getCurrentPassengerStation, updatePassengerStation, getCurrentStationBuses } from '../services/api';
import { Gyroscope } from 'expo-sensors';

const Buses = () => {
  const [station, setStation] = useState('');
  const [buses, setBuses] = useState([]);
  const [newStation, setNewStation] = useState('');
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [orientation, setOrientation] = useState('portrait'); // Estado para la orientación

  useEffect(() => {
    const fetchStationAndBuses = async () => {
      try {
        const currentStation = await getCurrentPassengerStation();
        setStation(currentStation);
        const currentBuses = await getCurrentStationBuses();
        setBuses(currentBuses);
      } catch (error) {
        console.error('Failed to fetch station and buses:', error);
      }
    };

    fetchStationAndBuses();

    Gyroscope.setUpdateInterval(1000); // Actualizar cada segundo
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setGyroscopeData(gyroscopeData);
      // Cambia la orientación basado en los datos del giroscopio
      if (Math.abs(gyroscopeData.x) > 0.5) {
        setOrientation(orientation => (orientation === 'portrait' ? 'landscape' : 'portrait'));
      }
    });

    return () => subscription.remove();
  }, []);

  const handleStationChange = async () => {
    try {
      await updatePassengerStation({ station: newStation });
      setStation(newStation);
      const updatedBuses = await getCurrentStationBuses();
      setBuses(updatedBuses);
    } catch (error) {
      console.error('Failed to update station:', error);
    }
  };

  const renderBusItem = ({ item }) => (
    <View style={styles.busContainer}>
      <Text style={styles.busText}>{item.name} - {item.route}</Text>
    </View>
  );

  // Aplica estilos condicionales en el renderizado
  const dynamicStyle = orientation === 'portrait' ? styles.portrait : styles.landscape;

  return (
    <View style={[styles.container, dynamicStyle]}>
      <Text style={styles.header}>Buses Respecto a tu Estación</Text>
      <Text style={styles.currentStation}>Estación Actual: {station}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Cambie de estación"
          value={newStation}
          onChangeText={setNewStation}
        />
        <Pressable style={styles.button} onPress={handleStationChange}>
          <Text style={styles.buttonText}>Actualizar Estación</Text>
        </Pressable>
      </View>
      <Text style={styles.subHeader}>Buses Disponibles:</Text>
      <FlatList
        data={buses}
        renderItem={renderBusItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.busList}
      />
    </View>
  );
};

// Define los estilos para las diferentes orientaciones
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background
    padding: 20,
  },
  // Estilos adicionales para las orientaciones
  portrait: {
    paddingHorizontal: 20,
  },
  landscape: {
    paddingHorizontal: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1', // Dark blue for text
    marginBottom: 20,
    textAlign: 'center',
  },
  currentStation: {
    fontSize: 18,
    color: '#0D47A1', // Dark blue for text
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#0D47A1',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#0D47A1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1', // Dark blue for text
    marginBottom: 10,
    textAlign: 'center',
  },
  busList: {
    alignItems: 'center',
  },
  busContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  busText: {
    fontSize: 18,
    color: '#0D47A1', // Dark blue for text
  },
});

export default Buses;
