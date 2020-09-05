import React from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { styles } from '../../styles/styles';
import { DB_TABLES, USER_PERMISSION, PARTY_MODES } from '../../../assets/utils'; 
import firebase from '../../../firebase.js';
import { CommonActions } from '@react-navigation/native';
import { color } from 'react-native-reanimated';

export default class PublicPartyItem extends React.Component {
    constructor(props) {
        super(props);
    }

    joinParty = async () => {
        const db = firebase.firestore();
        let { loggedInUser, joinId } = this.props;

        try {
            const response = await db.collection(DB_TABLES.PARTY).where('joinId', '==', parseInt(joinId)).limit(1).get();
            const party = response.docs[0];
            const partyId = party.id
            const data = party.data();
            const { participants, playlist, name, partyMode } = data;
            const playlistId = await this.getPlaylistId(playlist);

            const myUserInParticipants = participants.find(user => user.id === loggedInUser.id);
            if(myUserInParticipants) {
                loggedInUser = myUserInParticipants;
            } else {    //  User is new to this party
                loggedInUser.permission = partyMode === PARTY_MODES.FRIENDLY ? USER_PERMISSION.DJ : USER_PERMISSION.GUEST;
                participants.push(loggedInUser);
                await db.collection(DB_TABLES.PARTY).doc(partyId).update({ participants});
            }

            const navigateAction = CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Party Time Tab',
                        params: {
                            partyId: partyId,
                            playlist: playlistId,
                            isInvited: true,
                            participants,
                            loggedInUser
                        },
                    }
                    ],
            });
            this.props.navigation.dispatch(navigateAction);
        }
        catch (e) {
            console.log('Error join existing party', e);
            Alert.alert(`Could not load public party`);
        }
    }

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    render() {
        return (
            <TouchableOpacity onPress={this.joinParty}>
                <View style={{ ...styles.ActivePlaylistItem, flexDirection: "row", justifyContent: 'space-evenly', height: 60 }}>
                    <Text style={{ flex: 6,position:'relative',left:9, fontSize:16 }}>
                        {this.props.name}
                    </Text>
                    <Text style={{ flex: 6, color: this.props.condition === 'play' ? 'green' : 'red' }}>
                        {this.props.condition === 'pause'? 'Paused':'Playing'}
                    </Text>
                    <Text style={{ flex: 2 }}>
                        {this.props.joinId}
                    </Text>
                </View>

                {/* <View style={this.props.condition === 'play' ? styles.partyItemPlayed : styles.partyItemPaused}>
                    <Text style={{ flex: 6 }}>
                        {this.props.joinId} - {this.props.name}
                    </Text>
                    <Text style={{ flex: 6 }}>
                        status: {this.props.condition}
                    </Text>
                </View> */}
            </TouchableOpacity>
        )
    }
}