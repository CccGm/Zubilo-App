import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import PushNotification from 'react-native-push-notification';
import {useCoinContext} from '../Coin/CoinContext';
import Totalcoin from '../Coin/Totalcoin';
import {Color, FontFamily, FontSize} from '../GlobalStyles/GlobalStyles';
import {Telegram, coin} from '../images/img/Allimg';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [lastSpinTime, setLastSpinTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showInterstitial1, setShowInterstitial1] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const {addCoins} = useCoinContext();
  const adUnit = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyy';
  const adUnit2 = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyy';
  const adUnit3 = __DEV__
    ? TestIds.INTERSTITIAL
    : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyy';

  // const adUnit = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyy';
  // const adUnit2 = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyy';

  // useEffect(() => {
  //   PushNotification.configure({
  //     onNotification: function (notification) {
  //       console.log('Notification Received:', notification);
  //     },
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //   });

  //   PushNotification.localNotificationSchedule({
  //     message: 'Test Notification',
  //     date: new Date(Date.now() + 5 * 1000),
  //   });

  //   return () => {
  //     PushNotification.unregister();
  //   };
  // }, []);

  const interstitial = InterstitialAd.createForAdRequest(adUnit2, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['money', 'investment', 'income', 'stocks', 'trading'],
  });

  const rewaeded = InterstitialAd.createForAdRequest(adUnit3, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['money', 'investment', 'income', 'stocks', 'trading'],
  });

  useEffect(() => {
    const currentTime = new Date().getTime();
    const timeDiff = lastSpinTime ? currentTime - lastSpinTime : null;

    if (!lastSpinTime || timeDiff >= 2 * 60 * 1000) {
      const spinAnimation = Animated.timing(spinValue, {
        toValue: 20,
        duration: 120000,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      spinAnimation.start();
    } else {
      const remaining = 2 * 60 * 1000 - timeDiff;
      setTimeRemaining(remaining);
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1000);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [lastSpinTime, spinValue]);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        if (showInterstitial) {
          interstitial.show();
          setShowInterstitial(false);
        }
      },
    );

    interstitial.load();

    return unsubscribe;
  }, [showInterstitial]);

  useEffect(() => {
    const unsubscribe = rewaeded.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      if (showInterstitial1) {
        rewaeded.show();
        setShowInterstitial1(false);
      }
    });

    rewaeded.load();

    return unsubscribe;
  }, [showInterstitial1]);

  if (!loaded) {
    return null;
  }

  const startSpinAnimation = () => {
    addCoins(10);
    setLastSpinTime(new Date().getTime());
    setShowInterstitial(true);
  };

  const handleSpinPress = () => {
    if (!lastSpinTime || new Date().getTime() - lastSpinTime >= 2 * 60 * 1000) {
      startSpinAnimation();
    }
  };
  const handleNextPress = () => {
    setShowInterstitial1(true);
    navigation.navigate('Home2');
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = ms => {
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.homepagemain}>
        <Totalcoin />
        <View style={styles.zubiloParent}>
          <Text style={styles.textheading}>Zubilo</Text>
          <Animated.Image
            style={[
              styles.groupIcon,
              styles.groupLayout,
              {transform: [{rotateY: spin}]},
            ]}
            resizeMode="cover"
            source={coin}
          />
        </View>

        <View style={styles.buttonContainerl}>
          <TouchableOpacity style={styles.buttonrl} onPress={handleSpinPress}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: FontSize.size_xl,
              }}>
              Get Coins
            </Text>
          </TouchableOpacity>
        </View>

        {timeRemaining > 0 && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Next spin available in: {formatTime(timeRemaining)}
            </Text>
          </View>
        )}

        <View style={styles.containertellgramadvertise}>
          <BannerAd
            unitId={adUnit}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOtions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.textmore}>
            Click Here To {'\n'}
            Get More Coins
          </Text>
          <TouchableOpacity style={styles.buttonr} onPress={handleNextPress}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: FontSize.size_xl,
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containertellgram}>
          <Image
            style={styles.icontellgram}
            resizeMode="cover"
            source={Telegram}
          />
          <Text style={styles.textmoretellgram}>
            Join Telegram Channels {'\n'}
            Zubilo Daily Update News
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homepage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  homepagemain: {
    flex: 1,
    backgroundColor: 'black',
  },
  leftContainer: {},
  rightContainer: {
    top: 30,
    height: 35,
    backgroundColor: Color.colorGray_100,
    padding: 3,
    borderRadius: 6,
  },
  menu: {
    top: 20,
    width: 26,
    height: 22,
  },
  icon: {
    height: 50,
    width: 50,
  },
  coin1: {
    height: 30,
    width: 30,
  },
  textmore: {
    fontSize: FontSize.size_smf,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
    marginRight: 20,
  },
  coin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
  },
  textTypo: {
    fontSize: FontSize.size_xl,
    textAlign: 'left',
    color: Color.colorWhite,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
  },
  textheading: {
    fontSize: FontSize.size_13xl,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
  },
  zubiloParent: {
    marginTop: 20,
  },
  groupIcon: {
    left: '35%',
    bottom: '0%',
    right: '35%',
    top: '110%',
    height: '262%',
    width: '170%',
  },
  groupLayout: {
    maxWidth: '20%',
    position: 'absolute',
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainerl: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 140,
  },
  buttonr: {
    padding: 10,
    height: 50,
    width: 150,
    backgroundColor: Color.colorkabutar,
    borderRadius: 8, // Example border radius
  },
  buttonrl: {
    padding: 5,
    height: 40,
    width: 100,
    backgroundColor: 'gold',
    borderRadius: 5,
  },
  containertellgram: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    backgroundColor: Color.colordark,
    borderRadius: 25,
  },
  containertellgramadvertise: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
    marginTop: -2,
    height: 60,
    backgroundColor: 'white',
    padding: 0,
    backgroundColor: Color.colordark,
    borderRadius: 25,
  },
  icontellgram: {
    height: 50,
    width: 50,
    marginRight: 10,
  },
  textmoretellgram: {
    fontSize: FontSize.size_smf,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
    marginRight: 20,
    marginLeft: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 16,
    color: 'white',
  },
});
