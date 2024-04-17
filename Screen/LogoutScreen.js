import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import {
  Border,
  Color,
  FontFamily,
  FontSize,
} from '../GlobalStyles/GlobalStyles.js';
import {storage} from '../Utils/LocalStorage.js';
import {coin, coinicon} from '../images/img/Allimg.js';

const LogoutScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      const userToken = await storage.getString('userToken');
      if (!userToken) {
        navigation.navigate('Main');
      } else {
        const userDataString = await storage.getString('userInfo');
        if (userDataString) {
          const userDataObject = JSON.parse(userDataString);
          setUserData(userDataObject);
        }
      }
    };
    checkUserAuthentication();

    GoogleSignin.configure({
      webClientId:
        '532492374904-59ogpkop8t5bp1evea4t8b1pt22fuq8u.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const fetchTotalCoins = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDocRef = firestore().collection('users').doc(user.uid);
          userDocRef.onSnapshot(snapshot => {
            const userData = snapshot.data();
            if (userData) {
              setTotalCoins(userData.coin);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching total coins:', error);
      }
    };

    fetchTotalCoins();
  }, []);

  const TermsAndCondition = () => {
    navigation.navigate('Terms');
  };

  const signOut = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth().signOut();
        await storage.clearAll();
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'You are not signed in.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={[styles.userprofilepage, styles.groupItemLayout]}>
      {userData && (
        <>
          <Image
            style={styles.userprofilepageChild}
            resizeMode="cover"
            source={coinicon}
          />
          <View
            style={[
              styles.userprofilepageInner,
              styles.gilosaMarinaParentLayout,
            ]}>
            <View
              style={[
                styles.gilosaMarinaParent,
                styles.gilosaMarinaParentLayout,
              ]}>
              <Text style={[styles.gilosaMarina, styles.cFlexBox]}>
                {userData.name}
              </Text>
              <Text style={[styles.gilosaMarina1, styles.cFlexBox]}>
                {userData.email}
              </Text>
            </View>
          </View>
          <Image
            style={styles.userprofilepageItem}
            resizeMode="cover"
            source={{uri: userData.photo}}
          />
          <View>
            <View style={styles.rectangleParent}>
              <View style={[styles.groupChild, styles.childLayout]} />
              <Text style={[styles.totalEarnings, styles.cFlexBox]}>
                Total Earnings
              </Text>
            </View>
            <View style={[styles.userprofilepageChild1, styles.childLayout]} />
            <Text
              style={[styles.withdraw, styles.logoutTypo]}>{`Withdraw `}</Text>
            <View style={[styles.groupParent, styles.parentLayout]}>
              <View style={[styles.kParent, styles.parentLayout]}>
                <Text style={[styles.k, styles.kTypo]}>
                  {String(totalCoins)}
                </Text>
              </View>
              <View style={[styles.groupContainer, styles.groupPosition]}>
                <Image
                  style={[styles.groupItem, styles.groupPosition]}
                  resizeMode="cover"
                  source={coin}
                />
                <View style={[styles.cWrapper, styles.cLayout]}>
                  <Text style={[styles.c, styles.cLayout]}>C</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.rectangleView, styles.childLayout]} />
          <Text
            style={[styles.logout, styles.logoutTypo]}
            onPress={TermsAndCondition}>
            Terms and Conditions
          </Text>
          <View style={[styles.rectangleView, styles.childLayout]} />
          <Text style={[styles.logout, styles.logoutTypo]} onPress={signOut}>
            Logout
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  groupItemLayout: {
    flex: 1,
    overflowY: 'scroll',
    width: '100%',
  },
  gilosaMarinaParentLayout: {
    height: 29,
    width: 185,
    position: 'absolute',
  },
  cFlexBox: {
    textAlign: 'left',
    color: Color.colorWhite,
  },
  childLayout: {
    backgroundColor: Color.colorGray_100,
    borderRadius: Border.br_xl,
    height: 68,
    width: 345,
    position: 'absolute',
  },
  logoutTypo: {
    left: 45,
    fontSize: FontSize.size_base,
    textAlign: 'left',
    color: Color.colorWhite,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    position: 'absolute',
  },
  parentLayout: {
    height: 26,
    position: 'absolute',
  },
  kTypo: {
    textAlign: 'right',
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
    color: Color.colorWhite,
    position: 'absolute',
  },
  groupPosition: {
    left: '0%',
    position: 'absolute',
  },
  cLayout: {
    height: 6,
    width: 5,
    top: 0,
    position: 'absolute',
  },
  userprofilepageChild: {
    width: 310,
    height: 108,
    left: 30,
    top: 20,
    position: 'absolute',
  },
  gilosaMarina: {
    fontSize: 20,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    color: Color.colorWhite,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  gilosaMarina1: {
    fontSize: 12,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    color: Color.colorWhite,
    position: 'absolute',
    left: 0,
    top: 25,
  },
  groupIcon: {
    top: 5,
    left: 163,
    width: 22,
    height: 22,
    position: 'absolute',
  },
  gilosaMarinaParent: {
    left: 0,
    top: 0,
  },
  userprofilepageInner: {
    top: 172,
    left: 160,
  },
  userprofilepageItem: {
    top: 121,
    width: 120,
    height: 120,
    borderRadius: 90,
    left: 21,
    position: 'absolute',
  },
  groupChild: {
    left: 0,
    top: 0,
  },
  totalEarnings: {
    top: 24,
    left: 24,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    color: Color.colorWhite,
    position: 'absolute',
  },
  rectangleParent: {
    top: 279,
    height: 68,
    width: 345,
    left: 10,
    position: 'absolute',
  },
  rectangleView: {
    top: 467,
    left: 10,
  },
  logout: {
    top: 491,
  },
  userprofilepageChild1: {
    top: 373,
    left: 10,
  },
  withdraw: {
    top: 397,
  },
  k: {
    left: 7,
    fontSize: FontSize.size_base,
    top: 0,
  },
  text: {
    fontSize: FontSize.size_5xs,
  },
  coin: {
    fontSize: FontSize.size_9xs,
  },
  kParent: {
    left: 16,
    width: 55,
    top: 0,
  },
  groupItem: {
    height: '100%',
    top: '0%',
    right: '0%',
    bottom: '0%',
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  c: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.interRegular,
    textAlign: 'left',
    color: Color.colorWhite,
    left: 0,
  },
  cWrapper: {
    left: 3,
  },
  groupContainer: {
    height: '70.38%',
    width: '23.94%',
    top: '3.85%',
    right: '76.06%',
    bottom: '30.77%',
  },
  groupParent: {
    top: 303,
    left: 266,
    width: 71,
  },
  userprofilepage: {
    backgroundColor: Color.colorGray_200,
    flex: 1,
    // height: 852,
  },
});

export default LogoutScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert, StyleSheet } from 'react-native';
// import storage from '@react-native-async-storage/async-storage';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';

// const LogoutScreen = ({ navigation }) => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const checkUserAuthentication = async () => {
//       const userToken = await storage.getItem('userToken');
//       if (!userToken) {
//         navigation.navigate('Main');
//       } else {
//         const userDataString = await storage.getItem('userInfo');
//         if (userDataString) {
//           const userDataObject = JSON.parse(userDataString);
//           setUserData(userDataObject);
//         }
//       }
//     };
//     checkUserAuthentication();
//   }, []);

//   const signOut = async () => {
//     try {
//       const currentUser = auth().currentUser;
//       if (currentUser) {
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//         await auth().signOut();
//         await storage.removeItem('userToken');
//         navigation.navigate('Main');
//       } else {
//         Alert.alert('Error', 'You are not signed in.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'Failed to sign out.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View></View>
//       <View style={styles.userInfoContainer}>
//         {userData && (
//           <>
//             <Text style={styles.userInfoText}>Signed in as:</Text>
//             <Text style={styles.userInfoText}>{userData.name}</Text>
//             <Text style={styles.userInfoText}>{userData.email}</Text>
//           </>
//         )}
//       </View>
//       <Button title="Sign Out" onPress={signOut} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//   },
//   userInfoContainer: {
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   userInfoText: {
//     fontSize: 18,
//     marginBottom: 5,
//     color: '#333',
//   },
// });

// export default LogoutScreen;
