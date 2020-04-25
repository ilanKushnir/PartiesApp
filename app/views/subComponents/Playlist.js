import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './TrackItem.js';
import firebase from '../../../firebase.js';
import { styles } from '../../styles/styles.js';
import { Button } from 'react-native';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            playlistId: 'eNsALXiAswwhWgVolghC',
            tracks: []
        };
    }
    
    bindPlaylistChangesFromDB = async () => {
        const db = firebase.firestore();
        try {
            const DBbindingResponse = await db.collection('playlist').doc(this.state.playlistId).onSnapshot(snapshot => {
                let tracks = [];
                const data = snapshot.data();
                for (let trackId = 0; trackId < data.tracks.length; trackId++) {
                    data.tracks[trackId].get().then(result => {
                        const data = result.data();
                        if(data) {
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
            const trackReferencesOnDB = this.state.tracks.map(track => {
                return db.doc(`/track/${track.id}`);
            });
            await db.collection('playlist').doc(this.state.playlistId).set({
                tracks: trackReferencesOnDB
            });

            // this code overrides old playlist content on DB. to update it use doc().update({...})
        }
        catch (error) {
            console.log(error)
        }

    }

    onAddToPlaylist = async () => {
        const db = firebase.firestore();

        // TODO method that generates a <TrackItem> component 
        // <Search> component should return track details {videoId, snippet.title, snippet.thumbnails.high.url }
        const newTrack = {  //  dummy track
            id:{
                videoId: "AN0Bc5YF-pw"
            },
            snippet:{
                title: "9 Weird Things Only Mountain Bike Riders Do",
                thumbnails: {
                    high: {
                        url: "https://i.ytimg.com/vi/AN0Bc5YF-pw/default.jpg"
                    }
                }
            }
        }
        
        
        try {

            // const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=mountain+bike&type=video&key=AIzaSyAupliSgIaeUYlInVoB8PSqxX1CSerpkaY');
            // const responseJson = await response.json();
            // const trackssss = Array.from(responseJson.items);
            // for(let i = 0 ; i < trackssss.length; i++) {
            //     const response = await db.collection('track').add({
            //         videoId: trackssss[i].id.videoId,
            //         title: trackssss[i].snippet.title,
            //         image: trackssss[i].snippet.thumbnails.high.url
            //     });

            //     trackssss[i].id = response.id;
            //     this.setState({
            //     tracks: [...this.state.tracks, trackssss[i]]
            // });
            // }
            const response = await db.collection('track').add({
                videoId: newTrack.id.videoId,
                title: newTrack.snippet.title,
                image: newTrack.snippet.thumbnails.high.url
            });

            newTrack.id = response.id;
            this.setState({
                tracks: [...this.state.tracks, newTrack]
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
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return(
            <View style={{ flex: 3, paddingTop: 30 }}>
                <Button
                    onPress={this.onAddToPlaylist}
                    title="add (dummy) track to playlist & db"
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
                                    loadVideoFunc={this.props.loadVideoToPlayer}
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