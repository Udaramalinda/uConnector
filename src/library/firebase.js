const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getStorage } =  require('firebase/storage');

const firebaseConfig = {
  apiKey: 'AIzaSyBjYE6OWN18TFhPBE4LZ3oQ4J2XxVjwTTA',
  authDomain: 'uconnector-d50c6.firebaseapp.com',
  projectId: 'uconnector-d50c6',
  storageBucket: 'uconnector-d50c6.appspot.com',
  messagingSenderId: '873222365437',
  appId: '1:873222365437:web:1b0ff9b7213e4667451e94',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

module.exports = { auth, db, storage };