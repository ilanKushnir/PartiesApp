import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { PartyView } from './app/views/PartyView.js';

export default function App() {
  return (
    <View style={{padding: 30 }}>
      <View>
        <TextInput />
        <Button title="ADD" />
        <PartyView />
      </View>
      <View></View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
