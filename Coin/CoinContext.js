import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {storage} from '../Utils/LocalStorage';

const CoinContext = createContext();

export const useCoinContext = () => useContext(CoinContext);

export const CoinProvider = ({children}) => {
  const [totalCoins, setTotalCoins] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userDataStoredLocally, setUserDataStoredLocally] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userRef = firestore().collection('users').doc(user.email);

        userRef
          .get()
          .then(doc => {
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

        setUserEmail(user.email);
        try {
          const userDataString = await storage.getString('userInfo');
          const userData = JSON.parse(userDataString);
          if (userData && userData.email) {
            setUserEmail(userData.email);
            console.log('Email retrieved from AsyncStorage:', userData.email);
            setUserDataStoredLocally(true);
          }
        } catch (error) {
          console.error('Error retrieving email from AsyncStorage:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const storeUserDataLocally = async userData => {
    try {
      await storage.set('userInfo', JSON.stringify(userData));
      setUserDataStoredLocally(true);
      console.log('User data stored locally:', userData);
    } catch (error) {
      console.error('Error storing user data locally:', error);
    }
  };

  const updateUserEmail = email => {
    setUserEmail(email);
  };

  const generateReferralCode = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const codeLength = 6;

    let referralCode = '';

    for (let i = 0; i < codeLength; i++) {
      referralCode += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return referralCode;
  };

  const referralCode = generateReferralCode();
  console.log('Generated referral code:', referralCode);

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

    const userRef = firestore().collection('users').doc(user.uid);
    try {
      await firestore().runTransaction(async transaction => {
        const doc = await transaction.get(userRef);
        if (!doc.exists) {
          console.log('User document not found. Creating document...');
          const referralCode = generateReferralCode();
          console.log('Generated referral code:', referralCode);
          transaction.set(userRef, {
            coin: amount,
            email: userEmail,
            referralCode,
          });
          setTotalCoins(amount);
          console.log(
            'New user document created with referral code:',
            referralCode,
          );
          return;
        }

        const userData = doc.data();
        const newTotalCoins = (userData.coin || 0) + amount;

        transaction.update(userRef, {coin: newTotalCoins, email: userEmail});
        setTotalCoins(newTotalCoins);
      });

      console.log('User coins updated successfully in Firestore');
    } catch (error) {
      console.error('Error updating user coins in Firestore:', error);
    }
  };

  return (
    <CoinContext.Provider
      value={{
        totalCoins,
        addCoins,
        userEmail,
        userDataStoredLocally,
        updateUserEmail,
      }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContext;
