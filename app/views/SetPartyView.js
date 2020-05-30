import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Button, Keyboard} from 'react-native';
import PartyView from './PartyView'
import firebase from '../../firebase'
import DB_TABLES from '../../assets/utils'
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'

export default class SetPartyView extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            isNewParty: props.route.params.isNewParty,
            inputValue: ''
         }
    }

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    getAttributes = (isNewParty) => {
        const db = firebase.firestore();
        let message, inputPlaceholder, buttonText, handleSetParty;
        if(isNewParty){
            [message, inputPlaceholder, buttonText] = [
                'Please enter a name for your party', 
                'Party name', 
                'Start new party'
            ];
            handleSetParty = async (partyName) => {
                try {
                    const lastCreatedParty = await db.collection('party').orderBy('creationTime', 'desc').limit(1).get();
                    let joinId;
                    if(lastCreatedParty.docs[0]) {
                        const partyData = lastCreatedParty.docs[0].data();
                        joinId = partyData.joinId;
                        joinId++;
                    } else {
                        joinId = 100;
                    }
                    const userId = 1;

                    const playlistResponse = await db.collection('playlist').add({
                        tracks: []
                    });
                    const { id:playlistId } = playlistResponse;
                    const playlist = await db.doc(`/playlist/${playlistId}`);   // playlist Reference on DB

                    const currentTime = new Date();
                    const response = await db.collection('party').add({
                        joinId,
                        name: partyName || `Party #${joinId}`,
                        condition: 'pause',
                        playlist,
                        creationTime: currentTime,
                        activeVideoId: '',
                        currentTime: 0,
                        lastUpdatedTime: currentTime,
                        activeUsers: [ userId ]
                    });
                    
                    const partyId = response.id;
                    this.props.navigation.navigate('Party View', {
                        userId,
                        partyId,
                        isHost: true,
                        playlist: playlistId
                    });
                    } catch(error) {
                        console.log(`Error starting new party ${error}`);
                        Alert.alert(`Error starting new party`);
                    }
                };
        } else {    // join to existing party
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party ID',
                'Party ID',
                'Join'
            ];
            handleSetParty = async (joinId) => {
                try {
                    /////// TRANSACTION USE
                    // const response = await db.collection('party').where('joinId', '==', parseInt(joinId)).limit(1);
                    // // const partyRef = response.docs[0];
                    // let name, activeUsers, playlist, userId;

                    // const transaction = db.runTransaction(transaction => {
                    //     return transaction.get(response)
                    //       .then(party => {
                    //         const partyId = party.id
                    //         const data = party.data();
                    //         name = data.name;
                    //         activeUsers = data.activeUsers;
                    //         playlist = data.activeVideoId;
                            
                    //         userId = activeUsers[activeUsers.length - 1] + 1;
                    //         transaction.update(partyRef, { activeUsers: [...activeUsers, userId] });
                    //       });
                    //   }).then(result => {
                    //     Alert.alert(`Connected to Party ${name} succesfully`);
                    //     this.props.navigation.navigate('Party View', {
                    //         userId,
                    //         partyId,
                    //         isHost:false,
                    //         playlist
                    //     });
                    //     console.log('Transaction success!');
                    //   })

                    const response = await db.collection('party').where('joinId', '==', parseInt(joinId)).limit(1).get();
                    const party = response.docs[0];
                    const partyId = party.id
                    const data = party.data();
                    const { name, activeUsers, playlist, lastUpdatedTime } = data;
                    const playlistId = await this.getPlaylistId(playlist);
                    
                    const userId = activeUsers[activeUsers.length - 1] + 1;
                    await db.collection('party').doc(partyId).update({ activeUsers: [...activeUsers, userId] });
                    this.props.navigation.navigate('Party View', {
                        userId,
                        partyId,
                        isHost:false,
                        playlist: playlistId
                    });
                } catch (e) {
                    console.log('Error join existing party', e)
                    Alert.alert(`Could not load party with Join Id ${joinId}`)
                }
            };
        }
        return { message, inputPlaceholder, buttonText, handleSetParty };
    }
    render() {
        const { message, inputPlaceholder, buttonText, handleSetParty } = this.getAttributes(this.state.isNewParty);
        return (
            <View style={styles.center}>
                <Text style={styles.title}>{message}</Text>
                <TextInput style={styles.input} placeholder={inputPlaceholder} 
                            onChangeText={inputValue => this.setState({inputValue})}>
                </TextInput>
                <Button
                    onPress={() => {
                        Keyboard.dismiss();
                        handleSetParty(this.state.inputValue);
                    }}
                    title={buttonText}
                ></Button>
                <Button
                    onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}
                    title="Cancel"
                    color="#d2691e"
                ></Button>
            </View>
        );
    }
}
