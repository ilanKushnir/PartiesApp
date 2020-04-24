import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

export default class YoutubePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { youtubeVideoId: props.videoId };
    }
    
    render() {
        let youtubeUrl = `https://www.youtube.com/embed/${this.state.youtubeVideoId}`;

        return (
            <View style={{flex: 1}}>
                <Text>-- web view --</Text>
                    <WebView 
                        style={{ margin: 20}}
                        javascriptEnabled={true}
                        source={{uri: youtubeUrl}}
                    />
                <Text>-- web view --</Text>
            </View>
        )
    }
}