import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './TrackItem.js';
import firebase from '../../../firebase.js';
import { StackActions } from '@react-navigation/native';
import { styles } from '../../styles/styles.js';
import { Button } from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            playlistId: this.props.playlistId,
            tracks: []
        };

        this.db = firebase.firestore();
    }

    bindPlaylistChangesFromDB = async () => {
        try {
            const DBbindingResponse = await this.db.collection('playlist').doc(this.state.playlistId).onSnapshot(snapshot => {
                let tracks = [];
                const data = snapshot.data();

                if (data) { // if data is not undefined = the playlist exists in db
                    for (let trackId = 0; trackId < data.tracks.length; trackId++) {
                        data.tracks[trackId].get().then(result => {
                            const data = result.data();
                            if (data) {
                                data.id = result.id;
                                tracks.push(data);
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

    onRemoveFromPlaylist = async (trackId) => {
        try {
            const batch = this.db.batch();  //  batch perform ATOMIC action on DB
            console.log(`removing track with id: ${trackId}`);
            const remainingTracks = this.state.tracks.filter((track) => {
                return track.id !== trackId
            });
            console.log(remainingTracks);
            this.setState({
                tracks: remainingTracks
            }, () =>
                this.onUpdatePlaylist()
            );
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
                    <SwipeableFlatList
                        data={this.state.tracks}
                        keyExtractor={item => item.id}
                        bounceFirstRowOnMount={false}

                        renderItem={({ item }) => (
                            <TrackItem

                                style={{ height: 48 }}
                                key={item.id}
                                id={item.videoId}
                                title={item.title}
                                imageSrc={item.image}
                                item={item}
                                togglingMode={false}
                                onClickFunc={this.props.loadVideoToPlayer}
                            />
                        )
                        }
                       
                        renderLeft={({ item }) => (
                            <MaterialCommunityIcons
                                style={{
                                    width: 60,
                                    height: 60,
                                    position: "relative",
                                    top: 5,
                                    left: 15,

                                }}
                                onPress={() => this.onRemoveFromPlaylist(item.id)}
                                name="delete"
                                size={40}
                                color="#ff0000"
                            />
                        )}
                        // renderRight={({ item }) => (
                        //     <MaterialCommunityIcons
                        //         style={{
                        //             width: 60,
                        //             height: 60,
                        //             position: "relative",
                        //             top: 5,
                        //             left: 15,

                        //         }}
                        //         onPress={() => Alert.alert('Noice')}
                        //         name="heart-outline"
                        //         size={40}
                        //         color="#ff0000"
                        //     />
                        // )}

                    />
                )}

                {!this.state.listLoaded && (
                    <Text> LOADING... </Text>
                )}
            </View>
        )
    }
}