import React, {useEffect} from 'react';
import {Image, View} from 'react-native';
import app from '../images/s1.png';
import {useNavigation} from '@react-navigation/native';
import {storage} from '../Utils/LocalStorage';

function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(storage.getString('userToken') ? 'Homemain' : 'Main');
    }, 2000);
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={app}
        style={{width: 250, height: 300, resizeMode: 'contain'}}
      />
    </View>
  );
}

export default SplashScreen;
