import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Pressable, Alert, Image } from "react-native";
import BottomBar from "../navigation/BottomBar";
import { getPassenger, updatePassenger, deletePassenger } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Button, Dialog, Portal, Provider, TextInput } from "react-native-paper";
import { Gyroscope } from 'expo-sensors';
import pepo from "../media/pepo.jpg";

const { height } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({ firstName: '', lastName: '', email: '' });
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const getInfo = async () => {
      try {
        const passengerData = await getPassenger();
        setData(passengerData);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
        alert("Failed to fetch profile data");
      }
    };

    getInfo();
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

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('token');
    navigation.navigate("Login");
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await deletePassenger();
              await SecureStore.deleteItemAsync('token');
              await AsyncStorage.removeItem('token');
              navigation.navigate("Register");
            } catch (error) {
              console.error("Failed to delete profile", error);
              Alert.alert("Failed to delete profile", error.message || "An error occurred");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setEditData({ firstName: data.firstName, lastName: data.lastName, email: data.email });
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePassenger(editData);
      setData({ ...data, ...editData });
      setEditVisible(false);
      alert("Perfil actualizado correctamente!");
    } catch (error) {
      setError('Error al actualizar. Pruebe de nuevo.');
      alert("Failed to update profile");
    }
  };

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
    <Provider>
      <SafeAreaView style={[styles.container, getTransformStyle()]}>
        <View style={styles.header}>
          <Pressable onPress={logout} style={styles.logoutButton}>
            <Icon name="logout" size={25} color="#FFFFFF" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Image
            style={styles.profilePicture}
            source={pepo}
          />
          <View style={styles.profileInfo}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.info}>{data.firstName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Apellido</Text>
              <Text style={styles.info}>{data.lastName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.info}>{data.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={handleEdit} style={styles.button}>
            Editar Perfil
          </Button>
          <Button mode="contained" onPress={handleDelete} style={[styles.button, { backgroundColor: '#d32f2f' }]}>
            Eliminar Cuenta
          </Button>
        </View>
        <BottomBar />
        <Portal>
          <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
            <Dialog.Title>Editar Perfil</Dialog.Title>
            <Dialog.Content>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TextInput
                label="Nombre"
                value={editData.firstName}
                onChangeText={text => setEditData({ ...editData, firstName: text })}
                style={styles.input}
              />
              <TextInput
                label="Apellido"
                value={editData.lastName}
                onChangeText={text => setEditData({ ...editData, lastName: text })}
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={editData.email}
                onChangeText={text => setEditData({ ...editData, email: text })}
                style={styles.input}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setEditVisible(false)}>Cancelar</Button>
              <Button onPress={handleSaveEdit}>Guardar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  infoContainer: {
    width: '90%',
    backgroundColor: "#FFFFFF",
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
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#0D47A1",
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    color: "#0D47A1",
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#0D47A1',
  },
  input: {
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D47A1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
  },
  logoutText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Profile;
