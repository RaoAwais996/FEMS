import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyC9asfaUtPPiZadHlHpZBGjbLJjYdQ7ikg",
  authDomain: "vacation1-486fd.firebaseapp.com",
  projectId: "vacation1-486fd",
  storageBucket: "vacation1-486fd.appspot.com",
  messagingSenderId: "371883872158",
  appId: "1:371883872158:web:19a2b4516371076a45908f",
  measurementId: "G-RZ3KEP2MWJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.firestore();
