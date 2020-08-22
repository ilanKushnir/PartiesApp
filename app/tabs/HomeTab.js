import React from 'react';
import { View, Text, Button, Image, Dimensions } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';


export class HomeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: props.route.params.loggedInUser
    }
  }

  render() {
    const win = Dimensions.get('window');
    const ratio = 0.7*win.width/800;
    return (
      <View style={styles.homePage}>
        <Image style={{ width: 0.7*win.width, height: 300 * ratio, margin: 20 }} source={require('../../assets/logo/SYNCbeat-logo.png')}/>
        <Text style={styles.title}>Welcome {this.state.loggedInUser.name}!</Text>
        <Button title="Back To Login" onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}></Button>
      </View>
    )
  }
}