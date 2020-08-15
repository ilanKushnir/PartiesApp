import React from 'react'
import Navigator from './app/views/subComponents/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore
console.ignoredYellowBox = ['Warning:'];
import * as Linking from 'expo-linking';

export default class App extends React.Component {
  render() {
    return(
      <Navigator/>
    )
  }
}
