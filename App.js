import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import Navigator from './app/views/subComponents/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore
import * as Linking from 'expo-linking';


export default class App extends React.Component {

  _handleUrl = (url) => {
    this.setState({ url });
    let urlStr = url.url;
    const paramsArr = urlStr.split("=");
    console.log(paramsArr);
    if(paramsArr.length > 0) {
      const invitedPartyId = paramsArr[paramsArr.length-1];
      alert(`Invited to party ID: ${invitedPartyId} - handle redirection`);
      
      // Add here navigation redirection to join party 'invitedPartyId'

    }
  };
  
  componentDidMount() {
    Linking.getInitialURL()
      .then(url => {
        if(typeof(url) === Object){
          this._handleUrl( url );
        }
      })
      .catch(error => console.error(error));
    Linking.addEventListener('url', this._handleUrl);
  }
  
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrl);
  }
  

  render() {
    return(
      <Navigator/>
    )
  }
}
