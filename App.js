import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { PartyView } from './app/views/PartyView.js';

export default function App() {
  return (
    <View style={{padding: 30 }}>
      <View>
        <SetPartyView />
        <TextInput />
        <Button title="ADD" />
        <PartyView />

        <Button
        onPress={onPressPlayPause}
        title="Play Pause"
        color="#841584"
        accessibilityLabel="Play Pause" 
        />
      </View>
      <View></View>
    </View>
  );
}
const onPressPlayPause = async () => {
  const db = firebase.firestore()
  try {
    const party = await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').get()
    const currentCondition = party.data().condition

    const newCondition = invertCondition(currentCondition)
    // this.condition = newCondition
  await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').update({condition: newCondition})
  }
  catch (e) {
    console.log(e.message)
  }
}

const invertCondition = (cond) => {
return cond === 'play' ? 'pause' : 'play'
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
