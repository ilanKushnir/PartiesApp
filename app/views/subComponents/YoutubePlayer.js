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
            <View>
                <Text>-- web view --</Text>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: '<h1>Hello world</h1>' }}
                        style={{ backgroundColor:  'pink' }}
                    />

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