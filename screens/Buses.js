import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList } from 'react-native';
import { getCurrentPassengerStation, updatePassengerStation, getCurrentStationBuses } from '../services/api';

const Buses = () => {
  const [station, setStation] = useState('');
  const [buses, setBuses] = useState([]);
  const [newStation, setNewStation] = useState('');

  useEffect(() => {
    const fetchStationAndBuses = async () => {
      try {
        const currentStation = await getCurrentPassengerStation();
        console.log("Current Station:", currentStation);
        setStation(currentStation.name); // Asegurando que se usa el campo 'name'
        const currentBuses = await getCurrentStationBuses();
        console.log("Current Buses:", currentBuses);
        setBuses(currentBuses);
      } catch (error) {
        console.error('Failed to fetch station and buses:', error);
      }
    };

    fetchStationAndBuses();
  }, []);

  const handleStationChange = async () => {
    try {
      await updatePassengerStation({ name: newStation });
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MIRA LOS BUSES RESPECTO A TU ESTACION</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background
    padding: 20,
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
