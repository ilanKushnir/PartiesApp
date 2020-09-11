import React from 'react';
import { Text, View, TextInput, Alert, Button, Keyboard, Switch } from 'react-native';
import firebase from '../../../firebase';
import { styles } from '../../styles/styles.js';
import { StackActions } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { DB_TABLES, USER_PERMISSION, PARTY_MODES } from '../../../assets/utils'; 

export default class SetPartyView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isNewParty: props.route.params.isNewParty,
            inputValue: '',
            loggedInUser: props.route.params.loggedInUser,
            isPublic: false,
            partyMode: ''
        }
    }

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    getAttributes = (isNewParty) => {
        const db = firebase.firestore();
        let message, inputPlaceholder, buttonText, handleSetParty;
        if (isNewParty) {
            [message, inputPlaceholder, buttonText] = [
                'Please enter a name for your party',
                'Party name',
                'Start new party'
            ];
            handleSetParty = async (partyName) => {
                try {
                    const lastCreatedParty = await db.collection(DB_TABLES.PARTY).orderBy('joinId', 'desc').limit(1).get();
                    let joinId;
                    if (lastCreatedParty.docs[0]) {
                        const partyData = lastCreatedParty.docs[0].data();
                        joinId = partyData.joinId;
                        joinId++;
                    } else {
                        joinId = 100;
                    }
                    
                    const playlistResponse = await db.collection(DB_TABLES.PLAYLIST).add({
                        tracks: [db.doc(`/track/0JjxdBPLJqlKRe77plFz`)]
                    });
                    const { id: playlistId } = playlistResponse;
                    const playlist = await db.doc(`/playlist/${playlistId}`);   // playlist Reference on DB

                    const loggedInUser = this.state.loggedInUser;

                    loggedInUser.permission = USER_PERMISSION.HOST;
                    
                    const participants = [ loggedInUser ];
                    const isPublic = this.state.isPublic;
                    const partyMode = this.state.partyMode;
                    const currentTime = new Date();
                    const response = await db.collection(DB_TABLES.PARTY).add({
                        joinId,
                        name: partyName || `Party #${joinId}`,
                        condition: 'play',
                        playlist,
                        creationTime: currentTime,
                        activeVideoId: 'eirZ-weKAuw',
                        currentTime: 0,
                        lastUpdatedTime: currentTime,
                        participants,
                        isPublic,
                        partyMode
                    });

                    const partyId = response.id;
                    this.props.navigation.navigate('Party Drawer', {
                        partyId,
                        playlist: playlistId,
                        isInvited: false,
                        participants,
                        loggedInUser,
                        partyMode: partyMode
                    });
                } catch (error) {
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
                    const response = await db.collection(DB_TABLES.PARTY).where('joinId', '==', parseInt(joinId)).limit(1).get();
                    const party = response.docs[0];
                    const partyId = party.id
                    const data = party.data();
                    const { name, participants, playlist, lastUpdatedTime, partyMode } = data;
                    const playlistId = await this.getPlaylistId(playlist);

                    let loggedInUser = this.state.loggedInUser;

                    const myUserInParticipants = participants.find(user => user.id === loggedInUser.id);
                    if(myUserInParticipants) {
                        loggedInUser = myUserInParticipants;

                    } else {    //  User is new to this party
                        loggedInUser.permission = partyMode === PARTY_MODES.FRIENDLY ? USER_PERMISSION.DJ : USER_PERMISSION.GUEST;
                        participants.push(loggedInUser);
                        await db.collection(DB_TABLES.PARTY).doc(partyId).update({ participants });
                    }

                    this.props.navigation.navigate('Party Drawer', {
                        partyId,
                        isHost: false,
                        playlist: playlistId,
                        isInvited: false,
                        participants,
                        loggedInUser,
                        partyMode: partyMode
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
            <View style={{...styles.center,...styles.appBackgroundColor}}>
                <View style={{...styles.center,flex:0.2}}>
                    <Text style={styles.title}>{message}</Text>
                    <TextInput style={styles.input} placeholder={inputPlaceholder}
                        onChangeText={inputValue => this.setState({ inputValue })}>
                    </TextInput>
                </View>
                {this.state.isNewParty &&
                    <View style={{ flex: 0.2 }}>
                        <View style={{ ...styles.row, ...styles.publicSwitch }}>
                            <Text>Public</Text>
                            <Switch
                                value={this.state.isPublic}
                                onValueChange={(isPublic) => this.setState({ isPublic })}
                                thumbColor={this.state.isPublic ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                trackColor={{ false: "#767577", true: "#ff7752" }}
                            />
                        </View>
                        <View style={{...styles.partyModePicker, backgroundColor:'#fff7e3'}}>
                            <DropDownPicker
                                items={[
                                    { label: 'View Only', value: PARTY_MODES.VIEW_ONLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                                    { label: 'Friendly', value: PARTY_MODES.FRIENDLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                                ]}
                                placeholder="Select Party Mode "

                                containerStyle={{ height: 40, width: 180, marginTop: 10, marginBottom: 10 }}
                                style={{ backgroundColor: '#ffa974' }}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{ backgroundColor: '#ffa974' }}
                                onChangeItem={item => this.setState({ partyMode: item.value })}
                            />
                        </View>
                    </View>
                }
                <View style={{ flex: 0.25,position: 'absolute',bottom:50 }}>
                    <Button
                        style={{ marginBottom: 30 }}
                        disabled={this.state.isNewParty && this.state.partyMode === ''}
                        onPress={() => {
                            Keyboard.dismiss();
                            handleSetParty(this.state.inputValue);
                        }}
                        title={buttonText}
                    />
                    <Button
                        onPress={() => this.props.navigation.dispatch(StackActions.popToTop())}
                        title="Cancel"
                        color="#d2691e"
                    />
                </View>
            </View>
        );
    }
}
