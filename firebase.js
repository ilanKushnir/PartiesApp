// const firebase = require('firebase/app')
// require('firebase/firestore')
import * as firebase from 'firebase'
import '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDf0q5zv1edwTMWgY5ckzp3TxFDxRcMJ-Q",
  authDomain: "amazing-app-8e01e.firebaseapp.com",
  databaseURL: "https://amazing-app-8e01e.firebaseio.com",
  projectId: "amazing-app-8e01e",
  storageBucket: "amazing-app-8e01e.appspot.com",
  messagingSenderId: "22817374367",
  appId: "1:22817374367:web:a3f2eb51b42cc07943a2aa"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase