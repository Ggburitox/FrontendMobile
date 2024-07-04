import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import metro from '../media/logometropolitano.jpeg';
import { login } from '../services/api'; // Asegúrate de que esta función esté correctamente importada

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setError("Por favor, rellene todos los campos.");
      return;
    }
    setError('');
    handleLogin();
  };
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed', error);
      setError('Email o contraseña incorrectos. Pruebe de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={metro}
        />
        <Text style={styles.title}>Logeo</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          mode="outlined"
          accessibilityLabel="email"
          label="Email"
          placeholder="Introduce tu email"
          style={styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <TextInput
          mode="outlined"
          accessibilityLabel="password"
          label="Contraseña"
          placeholder="Introduce tu contraseña"
          secureTextEntry
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          theme={{ colors: { primary: '#007BFF' }}}
        />
        <Button style={styles.button} mode="contained" onPress={handleSubmit}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Button>
        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          ¿No tienes una cuenta? Regístrate
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Azul claro para el fondo
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: 150, // Aumentado para asegurar que el logo se vea completo
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
    width: '100%',
    backgroundColor: '#FFF',
    borderColor: '#79747E',
    marginVertical: 8,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    marginVertical: 16,
    backgroundColor: '#0D47A1', // Azul oscuro para el botón
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
  registerText: {
    color: "#007BFF", // Azul para el texto de registro
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  error: {
    marginTop: 16,
    color: "#ff0000",
  },
});

export default Login;
