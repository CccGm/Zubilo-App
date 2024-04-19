import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {useCoinContext} from '../Coin/CoinContext';

const WithDraw = () => {
  const navigation = useNavigation();
  const [upiId, setUpiId] = useState('');
  const {totalCoins, withDrawMoney} = useCoinContext();

  const handleClick = () => {
    let result = /^[\w.-]+@[\w.-]+$/.test(upiId);

    if (result) {
      let coin = totalCoins - 100;
      withDrawMoney(coin, upiId);
    } else {
      Alert.alert('Upi Id is Not Valid');
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 28}}> &#8610;</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 30, color: 'black', fontWeight: '500'}}>
          WithDraw Money
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{fontSize: 14}}> cancel</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
          paddingVertical: 50,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 14, color: '#696969'}}>Amount</Text>
          <Text
            style={{
              color: '#1f1d1d',
              fontSize: 45,
              fontWeight: '600',
            }}>
            &#8377; 10.00
          </Text>
        </View>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <Text style={{color: '#696969', fontSize: 18, fontWeight: '600'}}>
            ${totalCoins}
          </Text>
          <Text style={{color: '#696969', fontSize: 14}}>
            Available Balance
          </Text>
        </View>
      </View>
      <View style={{paddingLeft: 10}}>
        <Text style={{color: '#000000', fontSize: 16}}>
          &#8377; WithDraw Money To
        </Text>
      </View>

      <View style={{marginTop: 18}}>
        <TextInput
          value={upiId}
          onChangeText={text => setUpiId(text)}
          placeholder="Enter Your Upi Id"
          style={{
            borderWidth: 1,
            margin: 10,
            paddingLeft: 12,
            borderColor: 'lightblue',
            borderRadius: 12,
            color: '#00000090',
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: totalCoins < 100 ? '#58c5b79d' : '#58c5b7cb',
          alignItems: 'center',
          marginHorizontal: 18,
          borderRadius: 12,
          marginVertical: 35,
        }}
        onPress={handleClick}
        disabled={totalCoins < 100}>
        <Text style={{color: '#ffffff', fontSize: 18, padding: 10}}>
          {totalCoins < 100 ? 'Not Enough Coin' : 'Confirm Withdraw'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default WithDraw;
