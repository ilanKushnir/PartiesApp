import React from 'react';
import { Text, View, FlatList, Image } from 'react-native';
import TrackItem from './subComponents/TrackItem';
import YoutubePlayer from './subComponents/YoutubePlayer';

export class PartyView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = { 
            listLoaded: false,
            activeVideo: 'qSRrxpdMpVc'
        };
        console.log("on partyView:" , props)
    }

    componentDidMount() {
         return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=mountain+bike&type=video&key=AIzaSyCTsyYIUmK2QxzUCV8d-khZiHd8sNFLbNE')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    listLoaded: true,
                    videoList: Array.from(responseJson.items)
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    loadVideoToPlayer = (id) => {
        console.log(id)
        this.setState({
            activeVideo: id
        })
    }

    render() {
        return(
            <View>
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