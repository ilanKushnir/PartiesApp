import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert} from 'react-native';
import PartyView from './PartyView'
import firebase from '../../firebase'
import DB_TABLES from '../../assets/utils'

export default class SetPartyView extends React.Component {
    constructor(props) {
        super(this.props)

        this.state = {
            isNewParty: props.isNewParty,
            db: firebase.firestore()
        }
    }

    getAttributes = (isNewParty) => {
        let message, inputPlaceholder, buttonText, handleSetParty
        if(isNewParty){
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party name (optional)', 
                'Party name', 
                'Start new party'
            ]
            handleSetParty = async (partyName) => {
                try {
                    const response = await db.collection(DB_TABLES.PARTY).add({
                        name: partyName,
                        condition: 'pause',
                        playlist: ''
                    })
                    } catch(e) {
                        Alert.alert(`Error starting new party ${e}`)
                    }
                }  
        } else {
            [message, inputPlaceholder, buttonText] = [
                'Please enter Party ID',
                'Party ID',
                'Connect to Party'
            ]
            handleSetParty = async (partyId) => {
                try {
                    const party = await this.state.db.collection(DB_TABLES.PARTY).doc(partyId).get() 
                    const name = party.data().name
                    Alert.alert(`Connected to Party ${name} succesfully`)

                    return (
                        <PartyView props={{ partyId }} />                // <--- set app view to show this
                    )
                } catch (e) {
                    Alert.alert(`Could not load party with id ${partyId}`)
                }
            }
        }
    }

    render() {
        const { message, inputPlaceholder, buttonText, handleSetParty } = this.getAttributes(this.props.isNewParty)
        return (
            <View>
                <Text>{message}</Text>
                <TextInput>{inputPlaceholder}</TextInput>
                <TouchableOpacity onPress={handleSetParty}>
                    <Text>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

});