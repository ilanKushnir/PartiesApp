import firebase from '../firebase.js'

// CODE SAMPLES - take functioins from here and push to handle-functions invoking by React-Native components
    // ---> use on PartyView component
const bindPartyUpdates = async (partyId, partyInstance) => {    
    const db = firebase.firestore()
    const currentState = await db.collection('parties').doc(partyId).onSnapshot()
    const data = currentState.data()

    if (partyInstance) {    // use setState to change component props
        partyInstance.name = data.name
        partyInstance.condition = data.condition
        partyInstance.playlist = playlist
    }
}



// ---> use on PartyView or any youtube controller (the components which contains play/pause button)
const onPressPlayPause = async () => {
    const invertCondition = cond => {return cond === 'play' ? 'pause' : 'play'}
    const db = firebase.firestore()
    try {
      const party = await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').get()
      const currentCondition = party.data().condition
  
      const newCondition = invertCondition(currentCondition)
    await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').update({condition: newCondition})
    }
    catch (e) {
      console.log(e.message)
    }
  }

//   <Button
//   onPress={onPressPlayPause}
//   title="Play Pause"
//   color="#841584"
//   accessibilityLabel="Play Pause" 
//   />