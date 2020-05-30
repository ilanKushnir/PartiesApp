import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';

export class HomeTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Home</Text>
        <Button title="Back To Login" onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}></Button>
      </View>
    )
  }
}

