import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';

const UpdateModal = ({updatedVersion, navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
      <View
        style={{
          width: '90%',
          height: '20%',
          backgroundColor: '#fff',
          borderRadius: 20,
        }}>
        <Text
          style={{
            alignSelf: 'center',
            marginTop: 30,
            width: '90%',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
          }}>{`New App Version ${updatedVersion} available`}</Text>
        <TouchableOpacity
          style={{
            width: '90%',
            height: 50,
            backgroundColor: 'green',
            marginBottom: 20,
            marginLeft: 15,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
          }}
          // onPress={() => {
          //   Linking.openURL(
          //     'https://play.google.com/store/apps/details?id=com.yourapp.package',
          //   );

          // }}
        >
          <Text style={{color: '#fff'}}>Update Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateModal;
