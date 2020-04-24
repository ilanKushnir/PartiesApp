import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

export default class YoutubePlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let youtubeUrl = `https://www.youtube.com/embed/${this.props.videoId}`;
        console.log('youtube player loaded id: ', this.props.videoId);

        return (
            <WebView
                javascriptEnabled={true}
                source={{ uri: youtubeUrl }}
            />
        )
    }
}