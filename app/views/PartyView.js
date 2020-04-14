import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubePlayer from './subComponents/YoutubePlayer';
import firebase from '../../firebase';
import { styles } from '../styles/styles.js'


export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = { 
            listLoaded: false,
            activeVideo: 'qSRrxpdMpVc',
            partyId: props.route.params.partyId,
            party: {
                partyName: '',
                condition: '',
                playlist: ''
            }
        };
        console.log("Created partyView with partyId:" , props.route.params.partyId)
    }
    
    bindPartyChangesFromDB = async () => {
        const db = firebase.firestore();
        let counter = 0;
        try {
            const currentState = await db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                this.setState({
                    party: {
                        partyName: data.name,
                        condition: data.condition,
                        playlist: data.playlist
                    }
                });
                console.log('onSnapshot change-->', data.name, data.condition);
                counter++;
            })

            console.log(`PartyView --> onSnapshot party ${currentState}`);
            if(counter === 5) {
                currentState()
            }
        } catch (error) {
            console.log('bindParty changesFromDB error', error)
            Alert.alert(`Error getting updates from ${this.state.partyId}`);
        }


    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindPartyChangesFromDB()

            // fetch videos from youtube
            const response = await fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=mountain+bike&type=video&key=AIzaSyCTsyYIUmK2QxzUCV8d-khZiHd8sNFLbNE')            
            const responseJson = await response.json()
            this.setState({
                listLoaded: true,
                videoList: Array.from(responseJson.items)
            })
        } catch(error) {
            console.log(error);
        }
    }

    loadVideoToPlayer = (id) => {
        console.log('video id', id)
        this.setState({
            activeVideo: id
        })
    }

    onPressPlayPause = async () => {
        const db = firebase.firestore();
        try {
            const newCondition = this.state.party.condition === 'play' ? 'pause' : 'play'
            await db.collection('party').doc(this.state.partyId).update({condition: newCondition})
            const updatedParty = this.state.party
            updatedParty.condition = newCondition
            // this.setState({
                // party: updatedParty
            // })
        }
        catch (error) {
            console.log(error)
        }
      }

    render() {
        return(
            <View>
                <Text >{`Party ID - ${this.state.partyId}`}</Text>
                <Text >{this.state.party.condition === 'play' ? 'PARTY PLAYING' : 'PARTY PAUESED'}</Text>
                <TouchableOpacity onPress={this.onPressPlayPause}>
                    <Text >{ 'Play / Pause' }</Text>
                </TouchableOpacity>

                <YoutubePlayer videoId={this.state.activeVideo}/>
                {this.state.listLoaded && (
                    <View style={{ paddingTop: 30 }}>
                        <FlatList 
                            data={ this.state.videoList }
                            renderItem={({item}) => 
                                    <TrackItem
                                        key={item.id.videoId}
                                        id={item.id.videoId}
                                        title={item.snippet.title}
                                        imageSrc={item.snippet.thumbnails.high.url}
                                        loadVideoFunc={this.loadVideoToPlayer}
                                    />
                            }
                            keyExtractor={item => item.id.videoId}
                        />
                    </View>
                )}

                { !this.state.listLoaded && (
                    <View style={{ paddingTop: 30}}>
                        <Text> LOADING </Text>
                    </View>
                )}

            </View>
        )
    }
}