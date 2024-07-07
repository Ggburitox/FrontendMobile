import React, { useState } from "react";
import { StyleSheet, ScrollView, Image, SafeAreaView, Dimensions } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import  {register}  from "../services/api";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Register = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    setError('');
    try {
      await register({ firstName, lastName, email, password });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Register failed', error);
      setError('Error al registrar. Pruebe de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          style={styles.logo}
          source={require("../media/logo.jpg")} // Asegúrate de que esta ruta sea correcta
        />
        <Text style={styles.title}>Regístrate</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          mode="outlined"
          label="Nombre"
          placeholder="Introduce tu nombre"
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <TextInput
          mode="outlined"
          label="Apellidos"
          placeholder="Introduce tus apellidos"
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Introduce tu email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <TextInput
          mode="outlined"
          label="Contraseña"
          placeholder="Introduce tu contraseña"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Regístrate</Text>
        </Button>
        <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
          ¿Ya tiene una cuenta? Inicia Sesión!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Azul claro para el fondo
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#0D47A1", // Azul oscuro para el título
  },
  input: {
    width: width * 0.9, // 90% del ancho de la pantalla
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  button: {
    width: width * 0.9, // 90% del ancho de la pantalla
    paddingVertical: 10,
    marginVertical: 16,
    backgroundColor: '#0D47A1', // Azul oscuro para el botón
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    marginTop: 20,
    color: "#007BFF", // Azul para el texto de inicio de sesión
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Register;
