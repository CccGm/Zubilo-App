import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Share } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore'; // Import Firestore module

const Referlink = () => {
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    // Fetch referralCode data from Firestore based on user's UID
    const fetchReferralCode = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            const userData = doc.data();
            setReferralCode(userData.referralCode);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching referral code:', error);
      }
    };

    fetchReferralCode();
  }, []); // Run only once on component mount

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this amazing app! Use my referral code: ${referralCode}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with:', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Referral Code</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{referralCode}</Text>
      </View>
      <Button title="Share" onPress={onShare} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', // Light gray background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Dark gray text color
  },
  codeContainer: {
    backgroundColor: '#fff', // White background for code container
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc', // Light gray border
    alignItems: 'center',
  },
  code: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333', // Dark gray text color
  },
  button: {
    width: '100%', // Set button width to 100% of container width
    height: 100, // Enlarge button height
  },
});

export default Referlink;
