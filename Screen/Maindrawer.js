import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import HomeScreen from '../Screen1/HomeScreen';
import Home2 from '../Screen1/Home2';
import {Home, Invite, Me, Reward} from '../images/img/Allimg';
import Videoscreen from '../Screen2/Videoscreen';
import LogoutScreen from './LogoutScreen';
import Referlink from '../Refer/Referlink';
import Earning from './Earning';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        top: -25,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow,
      }}
      onPress={onPress}>
      <View
        style={{
          width: 55,
          height: 55,
          borderRadius: 35,
          backgroundColor: '#fff',
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const Maindrawer = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 15,
          right: 15,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 40,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Image source={Home} style={{width: 25, height: 25}} />
          ),
        }}
      />
      <Tab.Screen
        name="Earning"
        component={Earning}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Image source={Reward} style={{width: 25, height: 25}} />
          ),
        }}
      />
      <Tab.Screen
        name="Videoscreen"
        component={Videoscreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Image source={Reward} style={{width: 35, height: 35}} />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Referlink"
        component={Referlink}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Image source={Invite} style={{width: 25, height: 25}} />
          ),
        }}
      />
      <Tab.Screen
        name="LogoutScreen"
        component={LogoutScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <Image source={Me} style={{width: 25, height: 25}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 50,
      height: 50,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default Maindrawer;
