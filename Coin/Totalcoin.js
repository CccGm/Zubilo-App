import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import { User, smallcoin } from '../images/img/Allimg';

export default function Totalcoin() {
  const navigation = useNavigation();
  const [coinData, setCoinData] = useState({ name: '', totalCoins: 0 });

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDocRef = firebase.firestore().collection('users').doc(user.uid);
          // Fetch initial data
          const userSnapshot = await userDocRef.get();
          const userData = userSnapshot.data();
          if (userData) {
            const { coin, email } = userData;
            setCoinData({ name: email, totalCoins: coin });
          }
          // Set up listener for real-time updates
          userDocRef.onSnapshot((snapshot) => {
            const updatedUserData = snapshot.data();
            if (updatedUserData) {
              const { coin, email } = updatedUserData;
              setCoinData({ totalCoins: coin });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoinData();
  }, []);

  return (
    <View style={styles.homepage}>
      <View style={styles.leftContainer}>
        <Pressable
          style={styles.menu}
          onPress={() => navigation.navigate("UserProfilePage")}
        >
          <Image
            style={styles.icon}
            resizeMode="cover"
            source={User}
          />
        </Pressable>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.coin}>
          <Image
            style={styles.coin1}
            resizeMode="cover"
            source={smallcoin}
          />
          <Text style={[styles.text, styles.textTypo]}>{coinData.totalCoins}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  homepage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftContainer: {},
  rightContainer: {
    top: 30,
    height: 35,
    backgroundColor:'#272727',
    padding: 3,
    borderRadius: 6
  },
  menu: {
    top: 20,
    width: 26,
    height: 22,
  },
  icon: {
    height: 50,
    width: 50,
  },
  coin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coin1: {
    height: 30,
    width: 30,
  },
  text: {
    marginLeft: 5,
  },
  textTypo: {
    fontSize: 18,
    textAlign: 'left',
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  }
});