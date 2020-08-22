import React from 'react';
import { View, Text, Button } from 'react-native';
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
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Welcome {this.state.loggedInUser.name}!</Text>
        <Text>user stats</Text>
        <Text>user's top playlists</Text>
        <Button title="Log Out" onPress={() => this.props.navigation.navigate("Login", { logout: true })}></Button>
      </View>
    )
  }
}

