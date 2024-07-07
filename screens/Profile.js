import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Pressable, TextInput, Alert, Image } from "react-native";
import BottomBar from "../navigation/BottomBar";
import { getPassenger, updatePassenger, deletePassenger } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { Icon, Button, Dialog, Portal, Provider } from "react-native-paper";
import { Gyroscope } from 'expo-sensors';

const { height } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({ firstName: '', lastName: '', email: '' });
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', email: '' });
  const [error, setError] = useState('');
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });

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

    // Gyroscope setup
    Gyroscope.setUpdateInterval(1000); // Update every second
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setGyroscopeData(gyroscopeData);
    });

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate("Login");
  };

  const handleDelete = async () => {
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
              navigation.navigate("Login");
            } catch (error) {
              console.error("Failed to delete profile", error);
              alert("Failed to delete profile");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setEditData({ firstName: data.firstName, email: data.email });
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

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={logout} style={styles.logoutButton}>
            <Icon name="logout" size={25} color="#FFFFFF" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Image
            style={styles.profilePicture}
            source={require('../media/default-profile.png')} // Placeholder image
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
            {/* Display gyroscope data */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Gyroscope</Text>
              <Text style={styles.info}>X: {gyroscopeData.x.toFixed(2)}</Text>
              <Text style={styles.info}>Y: {gyroscopeData.y.toFixed(2)}</Text>
              <Text style={styles.info}>Z: {gyroscopeData.z.toFixed(2)}</Text>
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
    backgroundColor: "#E3F2FD", // Light blue background
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
    backgroundColor: "#FFFFFF", // White background for info container
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
    color: "#0D47A1", // Dark blue for label
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    color: "#0D47A1", // Dark blue for text
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#0D47A1', // Dark blue for button
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
