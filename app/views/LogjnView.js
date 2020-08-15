import React from 'react';
import { View,Text,TextInput,Button,Keyboard } from 'react-native';
import {styles} from "../styles/styles.js";
import * as Linking from 'expo-linking';

export class LoginView extends React.Component {
    constructor(props) {
        super(props);

        this.onPressLogin = this.onPressLogin.bind(this);
    }

    componentDidMount() {
        Linking.getInitialURL()
          .then(url => {
            if(url) {
              this._handleUrl( url );
            }
          })
          .catch(error => console.error(error));
         Linking.addEventListener('url', this._handleUrl);
      }
      
      componentWillUnmount() {
        Linking.removeEventListener('url', this._handleUrl);
      }

    _handleUrl = (url) => {
        const paramsArr = url.split("=");
        if(paramsArr.length > 1) {
          const invitedPartyId = paramsArr[paramsArr.length-1];
          this.setState({
              invitedPartyId: invitedPartyId
            });
          alert(`Invited to party ID: ${invitedPartyId} - handle redirection`);
        }
    };

    onPressLogin = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate("Bottom Tabs", {username: this.state.inputValue});
        // if(this.props) {
        //     this.props.navigation.navigate('Party View', {username: this.state.invitedPartyId});
        // }
    }

    render() {
        return(
            <View style={styles.center}>
                <Text style={styles.title}>Enter Your Name</Text>
                <TextInput style={styles.input} placeholder="Name" 
                            onChangeText={inputValue => this.setState({inputValue})}>
                </TextInput>
                <Button
                    onPress={this.onPressLogin}
                    title="Login"
                ></Button>
            </View>
        )
    }
}
