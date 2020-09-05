import React from 'react';
import { Text, View, Alert } from 'react-native';
import TrackItem from './TrackItem.js';
import firebase from '../../../firebase.js';
import { styles } from '../../styles/styles.js';
import { Button } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { DB_TABLES } from '../../../assets/utils';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            playlist: this.props.playlist,
            editMode: false,
            tracks: [],
            activeVideoIndex: 0
        };

        this.db = firebase.firestore();
    }



    toggleEditMode = () => {
        this.setState(prevState => ({
            editMode: !prevState.editMode
        }));
    }

    deleteTrackFromPlaylist = (item) => {
        const id = item.id
        const updatedTracks = this.state.tracks.filter(track => track.id !== id)

        this.setState({ tracks: updatedTracks })
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
            const DBbindingResponse = await this.db.collection(DB_TABLES.PLAYLIST).doc(this.state.playlistId).onSnapshot(snapshot => {
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
            await this.db.collection(DB_TABLES.PLAYLIST).doc(this.state.playlistId).set({
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
                const trackReference = this.db.collection(DB_TABLES.TRACK).doc();
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

        console.log(this.state.tracks);

    }

    loadVideoToPlayer = async (index) => {
        const videoId = this.state.tracks[index].videoId;
        this.setState({
            activeVideoIndex: index
        })
        this.props.loadVideoToPlayer(videoId);
    }

    loadNextVideoToPlayer = () => {
        if (this.state.activeVideoIndex < this.state.tracks.length - 1) {
            this.loadVideoToPlayer(this.state.activeVideoIndex + 1);
        }
    }

    loadPrevVideoToPlayer = () => {
        if (this.state.activeVideoIndex > 0) {
            this.loadVideoToPlayer(this.state.activeVideoIndex - 1);
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
            <View style={{ flex: 3, paddingTop: 0 }}>
                <View style={{ flexDirection: "row" }}>
                    <Button
                        onPress={() => {
                            this.toggleEditMode()
                        }}
                        title={this.state.editMode ? "Done" : "Edit"}
                        color={this.state.editMode ? "#87211c" : "#d2691e"}
                        disabled={!this.props.isDJ}
                    ></Button>

                    <Button
                        onPress={() => {
                            this.props.navigation.navigate('Add To Playlist', {
                                addTracksArrayToPlaylistFunc: this.onAddToPlaylist
                            })
                        }}
                        title="Add Tracks"
                        color="#d2691e"
                        disabled={!this.props.isDJ}
                    ></Button>
                </View>

                {this.state.listLoaded && (
                    <DraggableFlatList
                        data={this.state.tracks}
                        keyExtractor={item => item.id}
                        bounceFirstRowOnMount={false}
                        onDragEnd={({ data }) =>
                            this.setState({
                                tracks: data
                            }, () =>
                                this.onUpdatePlaylist()
                            )
                        }
                        renderItem={({ item, index, drag }) => (
                            <TrackItem
                                style={{ height: 48,...styles.PlaylistItem}}
                                key={item.id}
                                id={item.videoId}
                                title={item.title}
                                imageSrc={item.image}
                                item={item}
                                togglingMode={false}
                                onClickFunc={() => this.loadVideoToPlayer(index)}
                                onLongPress={drag}
                                editableMode={this.state.editMode}
                                deleteTrack={this.deleteTrackFromPlaylist}
                            />
                        )}
                    />
                )}
            </View>
        )
    }
}
