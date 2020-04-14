import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Button} from 'react-native';
import PartyView from './PartyView'
import firebase from '../../firebase'
import DB_TABLES from '../../assets/utils'
import { styles } from '../styles/styles.js'

export default class SetPartyView extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            isNewParty: props.route.params.isNewParty,
            inputValue: ''
         }
        console.log('############### isNewParty', props.route.params.isNewParty)
        this.getAttributes = this.getAttributes.bind(this);// ???
    }

    getAttributes = (isNewParty) => {
        const db = firebase.firestore()
        let message, inputPlaceholder, buttonText, handleSetParty
        if(isNewParty){
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party name (optional)', 
                'Party name', 
                'Start new party'
            ]
            handleSetParty = async (partyName) => {
                try {
                    const response = await db.collection('party').add({
                        name: partyName,
                        condition: 'pause',
                        playlist: ''
                    })
                    console.log(response.id);
                    
                    const partyId = response.id
                    Alert.alert(`Successfully created party with id ${partyId}`)
                    this.props.navigation.navigate('Party View', {partyId})
                   

                    } catch(e) {
                        Alert.alert(`Error starting new party ${e}`)
                    }
                }  
        } else {    // join to existing party
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party ID',
                'Party ID',
                'Connect to Party'
            ]
            handleSetParty = async (partyId) => {
                try {
                    
                    const party = await db.collection('party').doc(partyId).get()
                    
                    const name = party.data().name
                    Alert.alert(`Connected to Party ${name} succesfully`)
                    this.props.navigation.navigate('Party View', {partyId})

                } catch (e) {
                    Alert.alert(`Could not load party with id ${partyId}`)
                }
            }
        }
        return { message, inputPlaceholder, buttonText, handleSetParty }
    }

    render() {
        const { message, inputPlaceholder, buttonText, handleSetParty } = this.getAttributes(this.state.isNewParty)
        return (
            <View style={styles.center}>
                <Text>{message}</Text>
                <TextInput onChangeText={inputValue => {this.setState({inputValue})}}>{inputPlaceholder}</TextInput>
                <TouchableOpacity onPress={() => handleSetParty(this.state.inputValue)}>
                    <Text >{buttonText}</Text>
                    
                </TouchableOpacity>
            </View>
        )
    }
}

// const styles = StyleSheet.create({
//     button: {
//         flex: 2,
//         flexDirection: 'row',
//         alignItems: 'center'
//         }
// });