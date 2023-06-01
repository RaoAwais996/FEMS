import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  // Your Firebase configuration code
  apiKey: "AIzaSyAKzSbVTfNU0pWryjygqUPhq9UyFWGxft0",
  authDomain: "fems-8f272.firebaseapp.com",
  projectId: "fems-8f272",
  storageBucket: "fems-8f272.appspot.com",
  messagingSenderId: "827870461224",
  appId: "1:827870461224:web:858ae873a1a1e04ee0641d",
  measurementId: "G-EGB6WW8RF1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.firestore();
