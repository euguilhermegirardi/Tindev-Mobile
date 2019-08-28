import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png';
import api from '../services/api';
// <Form> doesn't exist = TextInput.

export default function Login({ navigation }) {
  // state
  const [user, setUser] = useState('');

  // Will execute when the component appear at the screen or when something changes.
  // () => {} means, execute this function [ ] empty array means, just once.
  // Will keep the user logged in.
  useEffect(() => {
    AsyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('Main', { user });
      }
    });
  }, [navigation]);

  async function handleLogin() {
    const response = await api.post('/devs', { username: user });

    // get the _id with response.data from the 'api'.
    const { _id } = response.data;

    // to stay the user logged in when you refresh the page.
    // to run it after install you must run 'pod install' inside of the file 'ios'.
    // yarn react-native run-ios.
    // name of the information that I want to save 'user' and the value '_id'.
    // finish with 'useEffect'.
    await AsyncStorage.setItem('user', _id);

    // use the '_id' as a second parameter to login the user.
    navigation.navigate('Main', { user: _id });
  }

  return (
    // KeyboardAvoidingView to slide everything up when open the keyboard.
    // Platform
    <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={styles.container}>
      <Image source={logo} />

      <TextInput
        autoCapitalize="none" // to get the first letter minuscula
        autoCorrect={false}
        style={styles.input}
        placeholder="GitHub user"
        placeholderTextColor="#999" // Don't edit with CSS.
        value={user}
        onChangeText={setUser}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#DF4723',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
