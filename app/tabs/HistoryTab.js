import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles.js'

export default HistoryTab = () =>
  <View style={{...styles.center,...styles.appBackgroundColor}}>
    <Text style={styles.title}>History</Text>
    <Text>A table of the parties that the user participated in..</Text>
    <Text>with the option to rejoin</Text>
  </View>


