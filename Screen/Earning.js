import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Play, User, coin} from '../images/img/Allimg';
import {Color, FontFamily, FontSize} from '../GlobalStyles/GlobalStyles';
import Totalcoin from '../Coin/Totalcoin';
import {useCoinContext} from '../Coin/CoinContext'; // Import useCoinContext hook
import {InterstitialAd} from 'react-native-google-mobile-ads';
import {AdEventType} from 'react-native-google-mobile-ads';

const adUnit3 = 'ca-app-pub-3923856095204835/7482181762';

const rewaeded = InterstitialAd.createForAdRequest(adUnit3, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['money', 'investment', 'income', 'stocks', 'trading'],
});

export default function Earning() {
  const [coinCount, setCoinCount] = useState(300);
  const [loaded, setLoaded] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const {addCoins} = useCoinContext(); // Use useCoinContext hook

  useEffect(() => {
    const unsubscribeLoaded = rewaeded.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeError = rewaeded.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('Interstitial Ad Error:', error);
        // Handle ad loading error here
      },
    );

    // Start loading the interstitial straight away
    rewaeded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }, []);

  const startSpinAnimation = () => {
    Animated.timing(spinValue, {
      toValue: 20,
      duration: 120000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handleSpinPress = () => {
    if (loaded) {
      startSpinAnimation();
      rewaeded.show();
      addCoins(2); // Add 10 coins
    } else {
      console.warn('Interstitial ad has not loaded yet.');
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.homepagemain}>
        <Totalcoin coinCount={coinCount} />
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

        <Text style={styles.titlemain}>Extra Money</Text>
        <View style={styles.topppp}>
          {[...Array(10)].map((_, index) => (
            <AdContainer key={index} handleSpinPress={handleSpinPress} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const AdContainer = ({handleSpinPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSpinPress}>
        <Image style={styles.icon} resizeMode="cover" source={User} />
      </TouchableOpacity>
      <Text style={styles.title}>Extra Money</Text>
      <TouchableOpacity onPress={handleSpinPress}>
        <Image style={styles.icon} resizeMode="cover" source={Play} />
        <Text style={styles.title1}>Click Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  homepagemain: {
    flex: 1,
    backgroundColor: 'black',
  },
  topppp: {
    marginBottom: 100,
  },
  textheading: {
    fontSize: FontSize.size_13xl,
    textAlign: 'center',
    color: Color.colorWhite,
    fontFamily: FontFamily.interBold,
    fontWeight: '700',
  },
  icon: {
    height: 30,
    width: 30,
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  titlemain: {
    marginTop: 130,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    height: 80,
    backgroundColor: 'white',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  title: {
    marginLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 40,
    marginLeft: 40,
  },
  title1: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: -8,
  },
});
