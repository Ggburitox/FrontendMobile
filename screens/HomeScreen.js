import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gyroscope } from 'expo-sensors';
import BottomBar from "../navigation/BottomBar";
import pepe from "../media/buse-de-la-linea-expreso-5.jpg";

const { height } = Dimensions.get("window");

const HomeScreen = () => {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    Gyroscope.setUpdateInterval(1000); // Update every second
    const subscription = Gyroscope.addListener(gyroscopeData => {
      const { x, y, z } = gyroscopeData;
      if (Math.abs(x) > Math.abs(y)) {
        setOrientation(x > 0 ? 'landscape-left' : 'landscape-right');
      } else {
        setOrientation(y > 0 ? 'portrait' : 'portrait-upside-down');
      }
    });

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

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
    <SafeAreaView style={[styles.container, getTransformStyle()]}>
      <View style={styles.content}>
        <Text style={styles.header}>Noticias</Text>
        <View style={styles.newsContainer}>
          <Text style={styles.newsText}>
            El 28 de Julio es el Día de la Independencia en el país. Por esta razón, ciertas rutas no brindarán servicio, incluyendo todos los expresos y las rutas SXN.
          </Text>
          <Image
            source={pepe}
            style={styles.image}
          />
        </View>
      </View>
      <BottomBar />
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
});

export default HomeScreen;
