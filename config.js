import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDwBrNzEbgh45RvkwAh7jr8r1JjJaR4jAQ",
  authDomain: "donatex-b51d2.firebaseapp.com",
  databaseURL: "https://donatex-b51d2.firebaseio.com",
  projectId: "donatex-b51d2",
  storageBucket: "donatex-b51d2.appspot.com",
  messagingSenderId: "174684316067",
  appId: "1:174684316067:web:b81e1c5846cd4fba913a16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
