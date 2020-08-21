
import React from 'react';
import { Text, View, Alert, TouchableOpacity, Button, Clipboard, Share } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubeView from './subComponents/YoutubeView';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js';
import { StackActions } from '@react-navigation/native';
import Playlist from './subComponents/Playlist.js';
import * as Linking from 'expo-linking';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';

const userPermissions = { HOST: 'HOST',DJ: 'DJ', GUEST: 'GUEST' };


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
            isInvited: props.route.params.isInvited,
            loggedInUser: props.route.params.loggedInUser
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
                const { joinId, name: partyName, condition, playlist, activeVideoId: id } = data;

                // If party is playing - fix deviation from last updated to current time
                const currentTime = condition === 'play' ?
                    this.fixCurrentTimeDeviation(data.currentTime, data.lastUpdatedTime) : data.currentTime;

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
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindParty changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }
    }

    updateHost = (participants) => {
        const hosts = participants.filter(user => user.permission === userPermissions.HOST);
        if(hosts.length) return participants;

        if(this.state.loggedInUser.permission === userPermissions.HOST) {
            for(let i = 0; i < participants.length; i++) {
                if(participants[i].permission === userPermissions.DJ) {
                    participants[i].permission = userPermissions.HOST;
                    return participants
                }
            }

            participants[0].permission = userPermissions.HOST;
        }
        
        return participants;
    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB();
        } catch (error) {
            console.log(error);
        }
    }

    loadNextVideoToPlayer = () => {
        this.playlistChildComponent.loadNextVideoToPlayer();
    }

    loadPrevVideoToPlayer = () => {
        this.playlistChildComponent.loadPrevVideoToPlayer();
    }

    loadVideoToPlayer = async (videoId) => {
        await this.db.collection('party').doc(this.state.partyId).update({ activeVideoId: videoId, currentTime: 0 });
    }

    updatePausedAndCurrentTimeInDB = async (currentTime) => {
        try {
            await this.db.collection('party').doc(this.state.partyId).update({
                currentTime: currentTime,
                condition: 'pause',
                lastUpdatedTime: new Date()
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    updatePlayedInDB = async () => {
        try {
            await this.db.collection('party').doc(this.state.partyId).update({
                condition: 'play',
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
        if (this.state.isInvited) {
            this.props.navigation.dispatch(StackActions.pop());
        } else {
            this.props.navigation.dispatch(StackActions.popToTop());
        }

        try {
            const party = await this.db.collection('party').doc(this.state.partyId).get();
            let { participants } = party.data();

            this.dbbindingResponse();           // unbind party changes from DB for this component
            if (participants.length === 1) {     // if last user - delete party
                const response = await this.db.collection('party').doc(this.state.partyId).delete();
                Alert.alert(`Party ${this.state.party.partyName} is closed for no active users`);
            } else {    // update active users
                participants = participants.filter(user => user.id !== this.state.loggedInUser.id);
                participants = this.updateHost(participants);

                await this.db.collection('party').doc(this.state.partyId).update({ participants });
            }
        } catch (error) {
            console.log(`Error on leave party ${error}`);
            Alert.alert(`Error on leave party`);
        }
    }

    onIdPress = async () => {
        let redirectUrl = Linking.makeUrl('parties-app-dev', { partyId: `${this.state.party.joinId}` });
        console.log(redirectUrl);
        try {
            const result = await Share.share({
                message:
                    `My Party ID is: ${this.state.party.joinId}

Join the Party NOW!
${redirectUrl}`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    Alert.alert("Invitation Sent!");
                } else {
                    Alert.alert("Invitation Sent!");
                }
            } else if (result.action === Share.dismissedAction) {
                Alert.alert("No one invited");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        return (

            <View style={{ flex: 1, backgroundColor: '#ECF0F1', }}>
                <View style={{ ...styles.rowHeader, flex: 0.5, position: 'relative', top: 10 }}>

                    <MaterialCommunityIcons
                        onPress={() => this.props.navigation.openDrawer()}
                        name="menu"
                        size={30}
                        color="#696969"
                    />
                    <MaterialCommunityIcons
                        onPress={this.onIdPress}
                        name="share-variant"
                        size={25}
                        color="#696969"
                    />
                    {/* <TouchableOpacity onPress={this.onIdPress}>
                        <Text style={styles.partyId}>{`ID: ${this.state.party.joinId}`}</Text>
                    </TouchableOpacity> */}

                    <Text style={styles.partyName}>{this.state.party.partyName}</Text>
                    <MaterialCommunityIcons
                        onPress={this.onPressLeaveParty}
                        name="logout"
                        size={30}
                        color="#ff0000"
                    />
                    {/* <Button title="Leave" onPress={this.onPressLeaveParty} color="#ff0000" /> */}
                </View>

                <View style={{ flex: 2.2, backgroundColor: '#000000' }}>
                    <YoutubeView style={{ backgroundColor: '#000000' }}
                        activeVideo={this.state.activeVideo}
                        condition={this.state.party.condition}
                        isHost={this.state.isHost}
                        isActionMaker={this.state.isActionMaker}
                        updatePaused={this.updatePausedAndCurrentTimeInDB}
                        updatePlayed={this.updatePlayedInDB}
                        loadNextVideoToPlayer={this.loadNextVideoToPlayer}
                        loadPrevVideoToPlayer={this.loadPrevVideoToPlayer}
                    />
                </View>
                <View style={{ flex: 2 }}>
                    <Playlist
                        ref={ref => this.playlistChildComponent = ref}
                        playlist={this.state.party.playlist}
                        loadVideoToPlayer={this.loadVideoToPlayer}
                        navigation={this.props.navigation}
                    />
                </View>
            </View>
        )
    }
}