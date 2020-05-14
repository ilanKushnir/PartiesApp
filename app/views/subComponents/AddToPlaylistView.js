import React from 'react';
import { Text, View, FlatList, Image, Alert, TouchableOpacity, Button, TextInput } from 'react-native';
import TrackItem from './TrackItem';
import YoutubeView from './YoutubeView';
import { styles } from '../../styles/styles.js'
import { StackActions } from '@react-navigation/native'
import { WebView } from 'react-native-webview';

export default class AddToPlaylistView extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            listLoaded: false,
            activeVideo: '',
            searchValue: '',
            tracksArray: []
        };
        this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
    }

    async componentDidMount() {
        this.fetchYoutubeVideos()
    }

    async fetchYoutubeVideos() {
        try {
            var searchString = this.state.searchValue.split(' ').join('+');
            // fetch videos from youtube
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.state.searchValue}&type=video&key=AIzaSyBA1MCrElZzexam8ythKLd4TvkhVYtxbos`)
            const responseJson = await response.json()
            // console.log(responseJson)
            this.setState({
                listLoaded: true,
                videoList: Array.from(responseJson.items)
            })
        } catch (error) {
            console.log(error);
        }
    }

    onChangeText = (text) => {
        this.setState({ searchValue: text })
    }

    addTrackToPlaylist = (track) => {
        const newTracksArray = this.state.tracksArray
        const itemIndex = (newTracksArray.size != 0) ? newTracksArray.findIndex(item => item.id.videoId === track.id.videoId) : -1

        if (itemIndex != -1) {
            newTracksArray.splice(itemIndex, 1)
            this.setState({ tracksArray: newTracksArray });
        } else {
            newTracksArray.push(track)
            this.setState({ tracksArray: newTracksArray });
        }
    }

    render() {
        return (

            <View style={{ flex: 1, padding: 10 }}>
                <View style={{
                    flexDirection: "col"
                }}>
                    <Text style={{ color: 'black' }}>Choose which tracks to add:</Text>
                    <Button
                        onPress={() => {
                            this.props.route.params.addTracksArrayToPlaylistFunc(this.state.tracksArray)
                            this.props.navigation.dispatch(StackActions.pop())
                        }}
                        title="Done"
                        color="#d2691e"
                    />
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <TextInput
                            style={{ flex: 5, height: 40, borderColor: 'gray', borderWidth: 1 }}
                            onChangeText={text => this.onChangeText(text)}
                            value={this.state.searchValue}
                            placeholder={'Search music...'}
                        />
                        <Button
                            style={{ flex: 1 }}
                            onPress={() => this.fetchYoutubeVideos()}
                            title="Search"
                            color="#d2691e"
                        />
                    </View>
                </View>

                <View style={{ flex: 5, paddingTop: 30 }}>
                    {this.state.listLoaded && (
                        <FlatList
                            data={this.state.videoList}
                            renderItem={({ item }) =>
                                <TrackItem
                                    key={item.id.videoId}
                                    id={item.id.videoId}
                                    title={item.snippet.title}
                                    imageSrc={item.snippet.thumbnails.high.url}
                                    togglingMode={true}
                                    item={item}
                                    onClickFunc={this.addTrackToPlaylist.bind(this)}
                                />
                            }
                            keyExtractor={item => item.id.videoId}
                        />
                    )}

                    {!this.state.listLoaded && (
                        <Text> LOADING </Text>
                    )}
                </View>

            </View>
        )
    }
}