import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import Navigator from './app/views/subComponents/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore

export default class App extends React.Component {
  
  render() {
    return(
      <Navigator/>
    )
  }
}
