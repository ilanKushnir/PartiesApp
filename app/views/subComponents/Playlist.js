import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'

export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistId: null,
            tracks: []
        };
    }
    
    bindPlaylistChangesFromDB = async () => {
        const db = firebase.firestore();
        try {
            const DBbindingResponse = await db.collection('playlist').doc(this.state.playlistId).onSnapshot(snapshot => {
                const data = snapshot.data();
                const { name } = data;
                const tracks = [];
                this.data.tracks.array.forEach(track => {
                    tracks.push(track);
                });

                this.setState({
                    tracks
                });
            });

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindPlaylist changes From DB error', error)
            Alert.alert(`Error getting updates from playlist #${this.state.playlistId}`);
        }


    }

    // invoke it whenever the client is making changes on his playlist component
    onUpdatePlaylist = async () => {
        const db = firebase.firestore();

        try {
            await db.collection('playlist').doc(this.state.playlist).set({
                name: this.state.name,
                tracks: this.state.tracks
            })

            // this code overrides old playlist content. to update it use doc().update({...})
        }
        catch (error) {
            console.log(error)
        }

    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPlaylistChangesFromDB()
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        // this component should render all track items with the data from youtube api (videoId, snippet.title, snippet.thumbnails.high.url) 
        // see example on partyView (Should be removed and placed here)
        return(
            <View >
                <TrackItem></TrackItem>
            </View>
        )
    }
}