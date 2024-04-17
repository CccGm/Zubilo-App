import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import Loginscreen from './Screen/Loginscreen';
import LogoutScreen from './Screen/LogoutScreen';
import Maindrawer from './Screen/Maindrawer';
import SplashScreen from './Screen/SplashScreen';
import Home2 from './Screen1/Home2';
import Home3 from './Screen1/Home3';
import Home4 from './Screen1/Home4';
import {storage} from './Utils/LocalStorage';
import UpdateModal from './src/components/UpdateModal';
import {CoinProvider} from './Coin/CoinContext';
import TermsAndConditions from './Screen/TermsAndCondition';

const Stack = createNativeStackNavigator();

export default function App() {
  const [updatedVersion, setUpdatedVersion] = useState('');
  const [initialRoute, setInitialRoute] = useState('Splash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkTokenValidity();
        await getVersion();
      } catch (error) {
        console.error('Error:', error);
        setInitialRoute('Main');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkTokenValidity = async () => {
    const userInfo = await storage.getString('userInfo');
    if (userInfo) {
      setInitialRoute('Homemain');
    }
  };

  const getVersion = async () => {
    const versionsSnapshot = await firestore().collection('versions').get();
    if (!versionsSnapshot.empty) {
      const versionData = versionsSnapshot.docs[0].data();
      const firebaseVersion = versionData.versions;
      setUpdatedVersion(firebaseVersion);
      checkVersionCompatibility(firebaseVersion);
    } else {
      console.warn('No version documents found');
      setInitialRoute('Main');
    }
  };

  const checkVersionCompatibility = firebaseVersion => {
    const appVersion = DeviceInfo.getVersion();
    console.log('App Version:', appVersion);
    console.log('Firebase Version:', firebaseVersion);

    if (appVersion !== firebaseVersion) {
      setInitialRoute('Update');
    }
  };

  return (
    <CoinProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={Loginscreen} />
          <Stack.Screen name="Homemain" component={Maindrawer} />
          <Stack.Screen name="Home2" component={Home2} />
          <Stack.Screen name="Home3" component={Home3} />
          <Stack.Screen name="Home4" component={Home4} />
          <Stack.Screen name="SignIn" component={LogoutScreen} />
          <Stack.Screen name="Terms" component={TermsAndConditions} />
          <Stack.Screen
            name="Update"
            component={() => <UpdateModal updatedVersion={updatedVersion} />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CoinProvider>
  );
}
