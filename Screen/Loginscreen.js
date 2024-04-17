import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../Utils/Colors';
import app from '../images/s1.png';
import Google from '../images/S2.png';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useCoinContext} from '../Coin/CoinContext';
import {storage} from '../Utils/LocalStorage';

const Loginscreen = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const {userEmail, updateUserEmail} = useCoinContext();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '532492374904-59ogpkop8t5bp1evea4t8b1pt22fuq8u.apps.googleusercontent.com',
    });
  }, []);

  const googlesignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      if (mobileNumber.length !== 10) {
        Alert.alert('Invalid mobile number.');
        return;
      }

      const {idToken, user} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);

      console.log('user >> ', user);

      const referralCodeValidity = await checkReferralCodeValidity(
        referralCode,
      );
      if (!referralCodeValidity) {
        setError('Invalid referral code.');
        return;
      }

      await writeToFirestore(user, mobileNumber, referralCode);

      await storage.set('userToken', idToken);
      await storage.set('userInfo', JSON.stringify(user));

      updateUserEmail(user?.email);
      navigation.navigate('Homemain');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message);
    }
  };

  const checkReferralCodeValidity = async referralCode => {
    if (!referralCode) {
      return true;
    }
    try {
      const referralQuerySnapshot = await firestore()
        .collection('users')
        .where('referralCode', '==', referralCode)
        .get();
      return !referralQuerySnapshot.empty;
    } catch (error) {
      console.error('Error checking referral code validity:', error);
      return false;
    }
  };

  const writeToFirestore = async (user, mobileNumber, referralCode) => {
    try {
      if (!user || !user.email) {
        console.error('User data is incomplete or undefined:', user);
        return;
      }

      const userData = {
        email: user.email,
        displayName: user.name || '',
        mobileNumber: mobileNumber,
        referralCode: referralCode || '',
      };

      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', user.email)
        .get();
      if (!querySnapshot.empty) {
        console.error('User with this email already exists in Firestore.');
        return;
      }

      await firestore().collection('users').doc(user.email).set(userData);
      console.log('User data written to Firestore successfully');
    } catch (error) {
      console.error('Error writing to Firestore:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={app}
        style={{
          width: 250,
          height: 300,
          resizeMode: 'contain',
          marginTop: 50,
        }}
      />
      <View
        style={{
          height: 400,
          backgroundColor: Colors.PRIMARY,
          width: '100%',
          marginTop: 10,
          padding: 0,
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 35,
            color: Colors.WHITE,
            fontWeight: '800',
          }}>
          ZUBILp
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 35,
            marginTop: 15,
            marginBottom: 15,
            color: Colors.LIGHT_PRIMARY,
          }}>
          Welcome To Zubilo
        </Text>
        <TextInput
          placeholder="Enter Mobile Number"
          placeholderTextColor="gray"
          style={{
            height: 40,
            width: '70%',
            backgroundColor: Colors.WHITE,
            marginTop: 20,
            paddingHorizontal: 10,
            borderRadius: 5,
            color: 'black',
          }}
          onChangeText={text => setMobileNumber(text)}
          value={mobileNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Enter Referral Code"
          placeholderTextColor="gray"
          style={{
            height: 40,
            width: '70%',
            backgroundColor: Colors.WHITE,
            marginTop: 20,
            paddingHorizontal: 10,
            borderRadius: 5,
            color: 'black',
          }}
          onChangeText={text => setReferralCode(text)}
          value={referralCode}
        />

        <TouchableOpacity
          onPress={googlesignIn}
          style={{
            backgroundColor: Colors.WHITE,
            width: '70%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 99,
            marginTop: 25,
          }}>
          <Image source={Google} style={{width: 40, height: 40}} />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: Colors.PRIMARY,
              fontWeight: '800',
            }}>
            Google Sign
          </Text>
        </TouchableOpacity>
        {error && <Text>{error}</Text>}
      </View>
    </View>
  );
};

export default Loginscreen;
