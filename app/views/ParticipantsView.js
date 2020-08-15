import React from 'react';
import { View, Text, Button } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';

export class ParticipantsView extends React.Component {
  
  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Participants blat</Text>
      </View>
    )
  }
}

