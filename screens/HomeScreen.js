import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar from "../navigation/BottomBar";
import { Gyroscope } from 'expo-sensors';

const { height } = Dimensions.get("window");

const HomeScreen = () => {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Gyroscope.setUpdateInterval(1000); // Update every second
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setGyroscopeData(gyroscopeData);
    });

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Noticias</Text>
        <View style={styles.newsContainer}>
          <Text style={styles.newsText}>
            El 28 de Julio es el Día de la Independencia en el país. Por esta razón, ciertas rutas no brindarán servicio, incluyendo todos los expresos y las rutas SXN.
          </Text>
          <Image
            source={require('../media/independence-day.jpg')}
            style={styles.image}
          />
          {/* Display gyroscope data */}
          <View>
            <Text style={styles.gyroscopeText}>Gyroscope Data:</Text>
            <Text style={styles.gyroscopeText}>X: {gyroscopeData.x.toFixed(2)}</Text>
            <Text style={styles.gyroscopeText}>Y: {gyroscopeData.y.toFixed(2)}</Text>
            <Text style={styles.gyroscopeText}>Z: {gyroscopeData.z.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      <BottomBar/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Light blue background
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#0D47A1", // Dark blue for text
    marginBottom: 20,
    textAlign: 'center',
  },
  newsContainer: {
    backgroundColor: "#FFFFFF", // White background for news container
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newsText: {
    fontSize: 18,
    color: "#0D47A1", // Dark blue for text
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  gyroscopeText: {
    fontSize: 16,
    color: "#0D47A1", // Dark blue for text
    marginTop: 10,
  },
});

export default HomeScreen;