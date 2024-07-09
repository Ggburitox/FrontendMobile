import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { getCurrentPassengerStation, updatePassengerStation, getCurrentStationBuses } from '../services/api';
import BottomBar from "../navigation/BottomBar";
import { Gyroscope } from 'expo-sensors';
import busImage from '../media/bus.jpg';

const Buses = () => {
  const [station, setStation] = useState('');
  const [buses, setBuses] = useState([]);
  const [newStation, setNewStation] = useState('');
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const fetchStationAndBuses = async () => {
      try {
        const currentStation = await getCurrentPassengerStation();
        console.log("Current Station:", currentStation);
        setStation(currentStation.name || 'Estación no disponible');
  
        const currentBuses = await getCurrentStationBuses();
        console.log("Current Buses:", currentBuses);
  
        if (Array.isArray(currentBuses)) {
          setBuses(currentBuses);
        } else {
          console.error('Expected an array of buses, but received:', currentBuses);
          setBuses([]);
        }
      } catch (error) {
        console.error('Failed to fetch station and buses:', error);
        setStation('Estación no disponible');
        setBuses([]);
      }
    };
  
    fetchStationAndBuses();
  }, []);
  
  useEffect(() => {
    Gyroscope.setUpdateInterval(1000);
    const subscription = Gyroscope.addListener(gyroscopeData => {
      const { x, y } = gyroscopeData;
      if (Math.abs(x) > Math.abs(y)) {
        setOrientation(x > 0 ? 'landscape-left' : 'landscape-right');
      } else {
        setOrientation(y > 0 ? 'portrait' : 'portrait-upside-down');
      }
    });

    return () => subscription.remove();
  }, []);

  const handleStationChange = async () => {
    try {
      await updatePassengerStation({ name: newStation });
      setStation(newStation);

      const updatedBuses = await getCurrentStationBuses();
      if (Array.isArray(updatedBuses)) {
        setBuses(updatedBuses);
      } else if (updatedBuses && Array.isArray(updatedBuses.buses)) {
        setBuses(updatedBuses.buses);
      } else {
        console.error('Expected an array of buses, but received:', updatedBuses);
        setBuses([]);
      }
    } catch (error) {
      console.error('Failed to update station:', error);
    }
  };

  const renderBusItem = ({ item }) => (
    <View style={styles.busContainer}>
      <Image source={busImage} style={styles.busImage} />
      <Text style={styles.busText}>Plate: {item.plate}, Route: {item.route?.name || "null"}</Text>
    </View>
  );

  const getTransformStyle = () => {
    switch (orientation) {
      case 'landscape-left':
        return { transform: [{ rotate: '90deg' }] };
      case 'landscape-right':
        return { transform: [{ rotate: '-90deg' }] };
      case 'portrait-upside-down':
        return { transform: [{ rotate: '180deg' }] };
      default:
        return { transform: [{ rotate: '0deg' }] };
    }
  };

  return (
    <View style={[styles.container, getTransformStyle()]}>
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
      {buses.length > 0 ? (
        <FlatList
          data={buses}
          renderItem={renderBusItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.busList}
        />
      ) : (
        <Text style={styles.noBusesText}>No hay buses disponibles.</Text>
      )}
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentStation: {
    fontSize: 18,
    color: '#0D47A1',
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
    color: '#0D47A1',
    marginBottom: 10,
    textAlign: 'center',
  },
  busList: {
    alignItems: 'center',
  },
  busContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  busImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  busText: {
    fontSize: 18,
    color: '#0D47A1',
  },
  noBusesText: {
    fontSize: 18,
    color: '#0D47A1',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Buses;
