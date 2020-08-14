import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import Navigator from './app/views/subComponents/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore
import * as Linking from 'expo-linking';


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      url: ''
    }
  }

  componentDidMount() {
    Linking.getInitialURL()
      .then(url => {
        if(url) {
          this.navigatorChildComponent._handleUrl( url );
        }
      })
      .catch(error => console.error(error));
     Linking.addEventListener('url', this.navigatorChildComponent._handleUrl);
  }
  
  componentWillUnmount() {
    Linking.removeEventListener('url', this.navigatorChildComponent._handleUrl);
  }
  

  render() {
    return(
      <Navigator
        ref={ref => this.navigatorChildComponent = ref}
      />
    )
  }
}
