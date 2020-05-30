import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './TrackItem.js';
import firebase from '../../../firebase.js';
import { StackActions } from '@react-navigation/native';
import { styles } from '../../styles/styles.js';
import { Button } from 'react-native';
import {MaterialCommunityIcons,Foundation} from 'react-native-vector-icons';



export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            playlist: this.props.playlist,
            tracks: []
        };

        this.db = firebase.firestore();
    }

    getPlaylistId = async () => {
        if (typeof this.state.playlist === "string") {
            return this.state.playlist;
        }
        const playlist = await this.state.playlist.get();
        return playlist.id;
    }

    bindPlaylistChangesFromDB = async () => {
        try {            
            const DBbindingResponse = await this.db.collection('playlist').doc(this.state.playlistId).onSnapshot(snapshot => {
                let tracks = [];
                const playlistData = snapshot.data();

                if (playlistData) { // if data is not undefined = the playlist exists in db
                    for (let trackId = 0; trackId < playlistData.tracks.length; trackId++) {
                        playlistData.tracks[trackId].get().then(result => {
                            const TrackData = result.data();
                            if (TrackData) {
                                TrackData.id = result.id;
                                tracks.push(TrackData);
                            }
                        }).then(() => {
                            this.setState({
                                tracks,
                                listLoaded: tracks.length !== 0
                            });
                        });
                    }
                }
                // TODO - add else statement for a scenario that the playlist was deleted from db
            });

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindPlaylist changes From DB error', error)
            Alert.alert(`Error getting updates from playlist #${this.state.playlistId}`);
        }
    }

    // invoke it whenever the client is making changes on his playlist component
    onUpdatePlaylist = async () => {
        try {
            const trackReferencesOnDB = this.state.tracks.map(track => {
                return this.db.doc(`/track/${track.id}`);
            });
            await this.db.collection('playlist').doc(this.state.playlistId).set({
                tracks: trackReferencesOnDB
            });

            // this code overrides old playlist content on DB. to update it use doc().update({...})
        }
        catch (error) {
            console.log(error)
        }

    }


    onAddToPlaylist = async (tracksRaw) => {    // can handle both single track or array of tracks
        // handle single track case
        if (tracksRaw.length === undefined) {
            tracksRaw = [tracksRaw];
        }

        const tracks = tracksRaw.map(track => ({
            videoId: track.id.videoId,
            title: track.snippet.title,
            image: track.snippet.thumbnails.high.url
        }));

        try {
            const batch = this.db.batch();  //  batch perform ATOMIC action on DB
            tracks.forEach(track => {
                const trackReference = this.db.collection('track').doc();
                batch.set(trackReference, track);
                track.id = trackReference.id;
                console.log('on batch, track uid', trackReference.id);
                
            });

            await batch.commit();

            this.setState({
                tracks: this.state.tracks.concat(tracks)
            });
            
            await this.onUpdatePlaylist();
        }
        catch (error) {
            console.log(error)
        }

    }

    async componentDidMount() {
        try {
            const playlistId = await this.getPlaylistId();
            this.setState({
                playlistId
            });
            // bind party continues updates from DB to this component
            await this.bindPlaylistChangesFromDB()
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View style={{ flex: 3, paddingTop: 30 }}>
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('Add To Playlist', {
                            addTracksArrayToPlaylistFunc: this.onAddToPlaylist
                        })
                    }}
                    title="Add Tracks To Playlist"
                    color="#d2691e"
                ></Button>

                {this.state.listLoaded && (
                    <FlatList
                        data={this.state.tracks}
                        renderItem={({ item }) =>
                            <TrackItem
                                key={item.id}
                                id={item.videoId}
                                title={item.title}
                                imageSrc={item.image}
                                item={item}
                                togglingMode={false}
                                onClickFunc={this.props.loadVideoToPlayer}
                            />
                        }
                        keyExtractor={item => item.id}
                    />
                )}

                {!this.state.listLoaded && (
                    <Text> LOADING... </Text>
                )}
            </View>
        )
    }
}