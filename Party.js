import firebase from '../firebase.js'

// CODE SAMPLES - take functioins from here and push to handle-functions invoking by React-Native components

export default class Party {
    // Current Party attributes
    id = null
    name = null
    condition = null
    playlist = null
    // db = firebase.firestore()

    async setNewParty(partyName) {
        const db = firebase.firestore()
        try {
        const response = await db.collection('parties').add({
            name: partyName,
            condition: 'pause',
            playlist: ''
        })
        } catch(e) {
            throw new Error(`Error starting new party with` , e)
        }
        
        this.id = response.id
        this.name = partyName
        this.condition = 'pause'
        this.playlist = ''
    }

    async setExistingParty(partyId) {
        const db = firebase.firestore()
        try {
            const party = await db.collection('parties').doc(partyId).get()
        } catch(e) {
            throw new Error(`Error getting party with id ${partyId}`, e)
        }
        const data = party.data()
        const { name, condition, playlist } = data

        this.id = partyId
        this.name = name
        this.condition = condition
        this.playlist = playlist
    }

    static async bindPartyUpdates (partyId, partyInstance) {
        const db = firebase.firestore()
        const currentState = await db.collection('parties').doc(partyId).onSnapshot()
        const data = currentState.data()

        if (partyInstance) {
            partyInstance.name = data.name
            partyInstance.condition = data.condition
            partyInstance.playlist = playlist
        }
    }

    async playPause () {
        const db = firebase.firestore()
        const party = await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').get()  // use the class parameters
        const currentCondition = party.data().condition
        
        const newCondition = invertCondition(currentCondition)
        this.condition = newCondition
        await db.collection('parties').doc('obQG8hZEirCDw2uMkP17').update({
                condition: newCondition
            })
    }
}


const invertCondition = (cond) => {
    return cond === 'play' ? 'pause' : 'play'
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

//   <Button
//   onPress={onPressPlayPause}
//   title="Play Pause"
//   color="#841584"
//   accessibilityLabel="Play Pause" 
//   />