import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {storage} from '../Utils/LocalStorage';
import {Alert} from 'react-native';

const CoinContext = createContext();

export const useCoinContext = () => useContext(CoinContext);

export const CoinProvider = ({children}) => {
  const [totalCoins, setTotalCoins] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [userDataStoredLocally, setUserDataStoredLocally] = useState(false);
  const [useRreferralCode, setReferralCode] = useState('');
  const [adsShow, setAdsShow] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          const userDataString = await storage.getString('userInfo');
          const userData = JSON.parse(userDataString);
          if (userData && userData.email) {
            setUserEmail(userData.email);
            getUser(userData.email);
            console.log('Email retrieved from AsyncStorage:', userData.email);
            setUserDataStoredLocally(true);
          }
        } catch (error) {
          console.error('Error retrieving email from AsyncStorage:', error);
        }
      }
    });

    if (userEmail !== '') {
      getUser(userEmail);
    }
    ADSSHOW();
    generateReferralCode();

    return unsubscribe;
  }, []);

  const getUser = email => {
    const userRef = firestore().collection('users').doc(email);
    userRef
      .get()
      .then(doc => {
        console.log(doc, 'first');
        if (doc.exists) {
          const userData = doc.data();
          setTotalCoins(userData.coin || 0);
          storeUserDataLocally(userData);
        } else {
          setTotalCoins(0);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  const storeUserDataLocally = async userData => {
    try {
      await storage.set('userInfo', JSON.stringify(userData));
      setUserDataStoredLocally(true);
      console.log('User data stored locally:', userData);
    } catch (error) {
      console.error('Error storing user data locally:', error);
    }
  };

  const generateReferralCode = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const codeLength = 6;

    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setReferralCode(code);
  };

  const addCoins = async amount => {
    if (totalCoins === null) {
      console.error('Total coins not yet initialized.');
      return;
    }
    const user = auth().currentUser;
    if (!user) {
      console.error('User not authenticated.');
      return;
    }

    const userRef = await firestore().collection('users').doc(userEmail).get();

    try {
      if (userRef.exists) {
        const userData = userRef.data();
        const coinSet = userData.coin ? userData.coin + amount : amount;
        await firestore()
          .collection('users')
          .doc(userEmail)
          .update({coin: coinSet})
          .then(() => {
            setTotalCoins(coinSet);
            console.log('updated user coin');
          });
      }
    } catch (error) {
      console.error('Error updating user coins in Firestore:', error);
    }
    // try {
    //   await firestore().runTransaction(async transaction => {
    //     const doc = await transaction.get(userRef);
    //     if (!doc.exists) {
    //       console.log('User document not found. Creating document...');
    //       console.log('Generated referral code 105:', useRreferralCode);
    //       transaction.set(userRef, {
    //         coin: amount,
    //         email: userEmail,
    //         useRreferralCode,
    //       });
    //       setTotalCoins(amount);
    //       console.log(
    //         'New user document created with referral code:',
    //         useRreferralCode,
    //       );
    //       return;
    //     }

    //     const userData = doc.data();
    //     const newTotalCoins = (userData.coin || 0) + amount;

    //     transaction.update(userRef, {coin: newTotalCoins, email: userEmail});
    //     setTotalCoins(newTotalCoins);
    //   });

    //   console.log('User coins updated successfully in Firestore');
    // } catch (error) {
    //   console.error('Error updating user coins in Firestore:', error);
    // }
  };

  const withDrawMoney = async (amount, upiId) => {
    const user = auth().currentUser;
    if (!user) {
      console.error('User not authenticated.');
      return;
    }

    const userRef = await firestore().collection('users').doc(userEmail).get();

    try {
      if (userRef.exists) {
        await firestore()
          .collection('users')
          .doc(userEmail)
          .update({coin: amount, upiId: upiId})
          .then(() => {
            setTotalCoins(amount);
            Alert.alert('Money will be received within 2 working days.');
          });
      }
    } catch (error) {
      console.error('Error updating user coins in Firestore:', error);
      Alert.alert('Money not Withdraw');
    }
  };

  const ADSSHOW = async () => {
    const versionsSnapshot = await firestore().collection('versions').get();
    if (!versionsSnapshot.empty) {
      const versionData = versionsSnapshot.docs[0].data();
      const show = versionData.ads;
      setAdsShow(show);
    } else {
      console.warn('No ads documents found');
      setAdsShow(false);
    }
  };

  return (
    <CoinContext.Provider
      value={{
        totalCoins,
        addCoins,
        userEmail,
        getUser,
        userDataStoredLocally,
        setUserEmail,
        useRreferralCode,
        withDrawMoney,
        adsShow,
      }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContext;
