import React from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubePlayer from './subComponents/YoutubePlayer';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import { WebView } from 'react-native-webview';
import Playlist from './subComponents/Playlist.js'



export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            activeVideo: 'XsFe56c_k2c',
            partyId: props.route.params.partyId,
            party: {
                joinId: '',
                partyName: '',
                condition: '',
                playlist: ''
            }
        };
        this.loadVideoToPlayer = this.loadVideoToPlayer.bind(this);
    }

    bindPartyChangesFromDB = async () => {
        const db = firebase.firestore();
        try {
            const DBbindingResponse = await db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                this.setState({
                    party: {
                        joinId: data.joinId,
                        partyName: data.name,
                        condition: data.condition,
                        playlist: data.playlist
                    }
                });
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindParty changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }


    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB()
        } catch (error) {
            console.log(error);
        }
    }

    loadVideoToPlayer = (id) => {
        this.setState({
            activeVideo: id
        })
    }

    onPressPlayPause = async () => {
        const db = firebase.firestore();
        try {
            const newCondition = this.state.party.condition === 'play' ? 'pause' : 'play'
            await db.collection('party').doc(this.state.partyId).update({ condition: newCondition })
            const updatedParty = this.state.party
            updatedParty.condition = newCondition
            this.setState({
            party: updatedParty
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    onPressLeaveParty = () =>
    // call componentWillUnmount and kill this component (and unbind DB listening)
    
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
                    onPress: () => this.props.navigation.dispatch(StackActions.popToTop())
                }
            ]
        );



    render() {
        return (

            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 }}>
                    <YoutubePlayer videoId={this.state.activeVideo} condition={this.state.party.condition}/>
                </View>

                <View style={{
                    flexDirection: "row"
                }}>
                    <Text style={styles.partyStat}>{`ID: ${this.state.party.joinId}`}</Text>
                    <Text style={styles.partyStat}>{this.state.party.condition === 'play' ? 'PLAYING' : 'PAUESED'}</Text>
                    <TouchableOpacity onPress={this.onPressPlayPause}>
                        <Text style={styles.partyStat}>{'Play / Pause'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressLeaveParty}>
                        <Text style={styles.partyStat}>Leave</Text>
                    </TouchableOpacity>
                </View>

                <Playlist loadVideoToPlayer={this.loadVideoToPlayer}/>

            </View>
        )
    }
}