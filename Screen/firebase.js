import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore'; // Import Firestore if you're using it
import '@react-native-firebase/auth'; // Import Auth if you're using it

const firebaseConfig = {
  apiKey: 'AIzaSyBrirFi3Q-4YH-KMTlTm5xcUXzGGw-xh94',
  authDomain: 'kxubilo.firebaseapp.com',
  projectId: 'kxubilo',
  storageBucket: 'kxubilo.appspot.com',
  messagingSenderId: '1:532492374904:android:0aff44ff2aa36cf238ee8d',
  appId: '1:532492374904:android:0aff44ff2aa36cf238ee8d',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;