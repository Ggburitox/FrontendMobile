import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { login } from '../services/api';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      navigation.navigate('Profile'); // Navigate to the profile screen after successful login
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An error occurred during login.');
      Alert.alert('Login Failed', error.message || 'An error occurred during login.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Logeate</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Button>
        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#0D47A1",
  },
  input: {
    width: width * 0.9,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  button: {
    width: width * 0.9,
    paddingVertical: 10,
    marginVertical: 16,
    backgroundColor: '#0D47A1',
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerText: {
    marginTop: 20,
    color: "#007BFF",
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Login;
