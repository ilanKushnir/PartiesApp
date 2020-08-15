import React from 'react';
import { View, Text, TextInput, Button, Keyboard, Alert } from 'react-native';
import { styles } from "../styles/styles.js";
import * as Linking from 'expo-linking';
import firebase from '../../firebase';

export class LoginView extends React.Component {
    constructor(props) {
        super(props);

        this.onPressLogin = this.onPressLogin.bind(this);
    }

    componentDidMount() {
        Linking.getInitialURL()
            .then(url => {
                if (url) {
                    this._handleUrl(url);
                }
            })
            .catch(error => console.error(error));
        Linking.addEventListener('url', this._handleUrl);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleUrl);
    }

    _handleUrl = (url) => {
        const paramsArr = url.split("=");
        if (paramsArr.length > 1) {
            const invitedPartyId = paramsArr[paramsArr.length - 1];
            this.setState({
                invitedPartyId: invitedPartyId
            });
        }
    };

    onPressLogin = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate("Bottom Tabs", { username: this.state.inputValue });
        if (this.state.invitedPartyId) {
            this.autoJoinInvitedParty(this.state.invitedPartyId);
        }
    }

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    async autoJoinInvitedParty(invitedPartyId) {
        const db = firebase.firestore();
        try {
            const response = await db.collection('party').where('joinId', '==', parseInt(invitedPartyId)).limit(1).get();
            const party = response.docs[0];
            const partyId = party.id
            const data = party.data();
            const { activeUsers, playlist, name } = data;
            const playlistId = await this.getPlaylistId(playlist);
            const userId = activeUsers[activeUsers.length - 1] + 1;
            Alert.alert(`Joining Party ${name}`);
            await db.collection('party').doc(partyId).update({ activeUsers: [...activeUsers, userId] });
            
            this.props.navigation.navigate('Party View', {
                partyId: partyId,
                isHost: false,
                userId,
                playlist: playlistId,
                isInvited: true
            });
        }
        catch (e) {
            console.log('Error join existing party', e)
            Alert.alert(`Could not load party with Join Id ${invitedPartyId}`)
        }
    }

    render() {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>Enter Your Name</Text>
                <TextInput style={styles.input} placeholder="Name"
                    onChangeText={inputValue => this.setState({ inputValue })}>
                </TextInput>
                <Button
                    onPress={this.onPressLogin}
                    title="Login"
                ></Button>
            </View>
        )
    }
}
