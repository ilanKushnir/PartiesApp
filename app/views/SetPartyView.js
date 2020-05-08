import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Button} from 'react-native';
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

    getAttributes = (isNewParty) => {
        const db = firebase.firestore()
        let message, inputPlaceholder, buttonText, handleSetParty
        if(isNewParty){
            [message, inputPlaceholder, buttonText] = [
                'Please enter a name for your party', 
                'Party name', 
                'Start new party'
            ]
            handleSetParty = async (partyName) => {
                try {
                    const lastCreatedParty = await db.collection('party').orderBy('creationTime', 'desc').limit(1).get();
                    const partyData = lastCreatedParty.docs[0].data();
                    let { joinId } = partyData;
                    joinId++;
                    
                    const response = await db.collection('party').add({
                        joinId,
                        name: partyName || `Party #${joinId}`,
                        condition: 'pause',
                        playlist: '',
                        creationTime: new Date(),
                        activeVideoId: '',
                        currentTime: 0
                    });
                    
                    const partyId = response.id
                    Alert.alert(`Successfully created ${partyName} party. Use id ${joinId} to join`)
                    this.props.navigation.navigate('Party View', 
                        {partyId,isHost: true})
                   
                    } catch(error) {
                        console.log(`Error starting new party ${error}`)
                        Alert.alert(`Error starting new party`)
                    }
                }  
        } else {    // join to existing party
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party ID',
                'Party ID',
                'Join'
            ]
            handleSetParty = async (joinId) => {
                try {
                    const response = await db.collection('party').where('joinId', '==', parseInt(joinId)).limit(1).get()
                    // TODO - handle wrond joinId
                    const party = response.docs[0]

                    const data = party.data()
                    const { name } = data
                    const partyId = party.id
                    
                    Alert.alert(`Connected to Party ${name} succesfully`)
                    this.props.navigation.navigate('Party View', 
                        {partyId,isHost:false})

                } catch (e) {
                    console.log('Error join existing party', e)
                    Alert.alert(`Could not load party with Join Id ${joinId}`)
                }
            }
        }
        return { message, inputPlaceholder, buttonText, handleSetParty }
    }

    render() {
        const { message, inputPlaceholder, buttonText, handleSetParty } = this.getAttributes(this.state.isNewParty)
        return (
            <View style={styles.center}>
                <Text style={styles.title}>{message}</Text>
                <TextInput style={styles.input} placeholder={inputPlaceholder} 
                            onChangeText={inputValue => {this.setState({inputValue})}}>
                </TextInput>
                <Button
                    onPress={() => handleSetParty(this.state.inputValue)}
                    title={buttonText}
                ></Button>
                <Button
                    onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}
                    title="Cancel"
                    color="#d2691e"
                ></Button>
            </View>
        )
    }
}
