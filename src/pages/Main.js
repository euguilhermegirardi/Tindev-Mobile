import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client'; // To receive the match information from websocket.
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
import like from '../assets/like.png';
import logo from '../assets/logo.png';
// View = Div; Text = any text tag.
// react-navigation = basic navigation between the pages.
// react-native-gesture-handler = dependecie from react-navigation (user touch).
// react-native-reanimated = route animated transitions
// pod install (inside of the file "ios") run react-native run-ios
// before create "routes".

export default function Main({ navigation }) {
  // to get the parameter that we need. Now we have the user's id.
  const id = navigation.getParam('user');
  // state
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: { user: id },
      });
      setUsers(response.data);
      // console.log(response.data);
    }
    loadUsers();
  }, [id]);

  // Connects to the websocket to get the 'match' in real time.
  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: id },
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    });
    // Execute this when the 'id' changes.
  }, [id]);

  async function handleLike() {
    // to get the first user.
    // const user = users[0];
    // So... [user, ...rest] means, 'user' = first user and '...rest' all the other users.
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id },
    });

    // setUsers(users.filter(user => user._id !== id));
    // As the first user already appeared, save the rest of the users.
    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id },
    });

    // setUsers(users.filter(user => user._id !== id));
    setUsers(rest);
  }

  // to logout the user.
  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    // just a better configuration.
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>No more devs! :(</Text>
        ) : (
          /* index = position of the user */
          users.map((user, index) => (
            /* users.length - index = get the first user menos the next one */
            <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
              <Image style={styles.avatar} source={{ uri: user.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* show only if user.lenght is greater than 0. */}
      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleDislike} style={styles.button}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} style={styles.button}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}
      {matchDev && (
        <View style={styles.matchContainer}>
          <Image style={styles.matchImage} source={itsamatch} />
          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          {/* To close the window */}
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    flex: 1,
    height: 300,
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },

  buttonsContainer: {
    flexDirection: 'row', // main config, is 'column', so the buttons would be in column without 'row'.
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between', // centralize the middle container.
  },

  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch', // full image in the screen.
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  empty: {
    alignSelf: 'center',
    paddingBottom: 280,
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  logo: {
    marginTop: 30,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#FFF',
    marginVertical: 30,
  },

  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },

  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  closeMatch: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});
