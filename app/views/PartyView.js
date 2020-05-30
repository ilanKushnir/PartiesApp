
import React from 'react';
import { Text, View, Alert, TouchableOpacity, Button, Clipboard } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubeView from './subComponents/YoutubeView';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import Playlist from './subComponents/Playlist.js'
import Player from './subComponents/Player.js'

export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            activeVideo: {
                id: '',
                currentTime: 0,
                lastUpdatedTime: ''
            },
            partyId: props.route.params.partyId,
            party: {
                joinId: '',
                partyName: '',
                condition: '',
                playlist: props.route.params.playlist
            },
            userId: props.route.params.userId,
            isHost: props.route.params.isHost,
            isActionMaker: false
        };
        this.loadVideoToPlayer = this.loadVideoToPlayer.bind(this);
        this.db = firebase.firestore();
    }

    fixCurrentTimeDeviation = (videoTime, lastUpdatedTime) => {
        const currentTime = new Date();
        const delta = (currentTime - lastUpdatedTime.toDate()) / 1000;

        return parseInt(videoTime) + delta;
    }

    bindPartyChangesFromDB = async () => {
        try {
            this.dbbindingResponse = await this.db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                const { joinId, name:partyName, condition, playlist, activeVideoId:id } = data;

                // If party is playing - fix deviation from last updated to current time
                const currentTime = condition === 'play' ? 
                    this.fixCurrentTimeDeviation(data.currentTime, data.lastUpdatedTime) :  data.currentTime ;
                
                this.setState({
                    party: {
                        joinId,
                        partyName,
                        condition,
                        playlist,
                    },
                    activeVideo: {
                        id,
                        currentTime
                    }
                });
                
                this.updateHost(data.activeUsers);
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindParty changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }
    }

    updateHost = (activeUsers) => {
        const isHost = activeUsers[0] === this.state.userId;
        if (isHost && !this.state.isHost) {
            Alert.alert(`You are now ${this.state.party.partyName} new host!`)
        }
        this.setState({
            isHost
        })
    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB();
        } catch (error) {
            console.log(error);
        }
    }

    loadVideoToPlayer = async (item) => {
        const id = item.videoId
        await this.db.collection('party').doc(this.state.partyId).update({ activeVideoId: id, currentTime: 0 });
    }

    updateCurrentTimeInDB = async (currentTime) => {
        this.setState({
            isActionMaker: false
        });
        await this.db.collection('party').doc(this.state.partyId).update({ currentTime });
    }

    onPressPlayPause = async () => {
        try {
            const newCondition = this.state.party.condition === 'play' ? 'pause' : 'play';
            this.setState({
                isActionMaker: true
            });

            await this.db.collection('party').doc(this.state.partyId).update({ 
                condition: newCondition,
                lastUpdatedTime: new Date()
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    onPressLeaveParty = () => {
        Alert.alert(
            'Leaving so soon?',
            'Are you sure you want to leave this party?',
            [
                {
                    text: 'Stay',
                    onPress: () => { }
                },
                {
                    text: 'Leave',
                    onPress: () => { this.leaveParty(); }
                }
            ]
        );
    }

    leaveParty = async () => {
        this.props.navigation.dispatch(StackActions.popToTop());

        try {
            const party = await this.db.collection('party').doc(this.state.partyId).get();
            let { activeUsers } = party.data();

            this.dbbindingResponse();           // unbind party changes from DB for this component
            if (activeUsers.length === 1) {     // if last user - delete party
                const response = await this.db.collection('party').doc(this.state.partyId).delete();
                Alert.alert(`Party ${this.state.party.partyName} is closed for no active users`);
            } else {    // update active users
                activeUsers = activeUsers.filter(userId => userId !== this.state.userId);
                await this.db.collection('party').doc(this.state.partyId).update({ activeUsers });
            }
        } catch (error) {
            console.log(`Error on leave party ${error}`);
            Alert.alert(`Error on leave party`);
        }
    }


    render() {
        return (

            <View style={{ flex: 1 }}>
                <View style={styles.rowHeader}>
                    <TouchableOpacity onPress={() => {
                        Clipboard.setString(`${this.state.party.joinId}`);
                        Alert.alert("Party id copied to clipboard");
                    }}>
                        <Text style={styles.partyId}>{`ID: ${this.state.party.joinId}`}</Text>
                    </TouchableOpacity>
                    <Text style={styles.partyName}>{this.state.party.partyName}</Text>
                    <Button title="Leave" onPress={this.onPressLeaveParty} color="#ff0000"/>
                </View>

                <View style={{ flex: 3 }}>
                    <YoutubeView
                        activeVideo={this.state.activeVideo}
                        condition={this.state.party.condition}
                        updateCurrentTimeInDB={this.updateCurrentTimeInDB}
                        isHost={this.state.isHost}
                        isActionMaker={this.state.isActionMaker}
                    />
                </View>

                <Player onPressPlayPause={this.onPressPlayPause} condition={this.state.party.condition}></Player>

                <Playlist
                    playlist={this.state.party.playlist}
                    loadVideoToPlayer={this.loadVideoToPlayer}
                    navigation={this.props.navigation}
                />
            </View>
        )
    }
}