import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';

export class HomeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.route.params.username
    }
  }

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Hi {this.state.username}!</Text>
        <Text style={styles.title}>Welcome back you mother fucker</Text>
        <Text>user stats</Text>
        <Text>user's top playlists</Text>
        <Button title="Back To Login" onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}></Button>
      </View>
    )
  }
}

