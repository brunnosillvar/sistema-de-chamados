import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyAxXO0rwj1vAhQqVgOYcUm0LOhhfc7uEnU",
  authDomain: "sistema-de-chamados-dd590.firebaseapp.com",
  projectId: "sistema-de-chamados-dd590",
  storageBucket: "sistema-de-chamados-dd590.appspot.com",
  messagingSenderId: "983610349657",
  appId: "1:983610349657:web:7987e49a8c7675c0623948",
  measurementId: "G-3SQN36VC0F"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export default firebase;