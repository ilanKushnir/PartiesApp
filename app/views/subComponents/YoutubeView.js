import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { styles } from '../../styles/styles.js';

const playVideo = 'player.playVideo();'
const pauseVideo = 'player.pauseVideo();'
const getCurrentTime = 'window.ReactNativeWebView.postMessage(player.getCurrentTime());'

export default class YoutubeView extends React.Component {
    constructor(props) {
        super(props);
    }

    onMessageHandler = (data) => {
        if (data === "ended") {
            this.props.loadNextVideoToPlayer();
        } else {
            this.props.updatePaused(data);
        }
    }

    onPressPlayPause = () => {
        const newCondition = this.props.condition === 'play' ? 'pause' : 'play';
        const playerAction = newCondition === 'play' ? playVideo : pauseVideo;
        this.webref.injectJavaScript(playerAction);
        if (newCondition === 'pause') {
            this.webref.injectJavaScript(getCurrentTime);
        } else {
            this.props.updatePlayed();
        }
    }

    render() {

        const html = `
            <!DOCTYPE html>
            <html>
            <body>
                <div id="player"></div>
                <script>
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                var player;
                function onYouTubeIframeAPIReady() {
                    player = new YT.Player('player', {
                        height: 550,
                        width: 960,
                        playerVars: {
                            enablejsapi: 1,
                            rel: 0,
                            controls: 0,
                            fs: 0,
                            playsinline: 1,
                            modestbranding: 1
                        },
                        videoId: '${this.props.activeVideo.id}',
                        events: {
                            
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }

                function onPlayerStateChange(event) {
                    } else if(${this.props.isHost} && event.data === YT.PlayerState.ENDED) {
                        window.ReactNativeWebView.postMessage("ended");
                    }
                }

               </script>
            </body>
            </html>`;

        let playerState = this.props.condition === 'play' ? playVideo : pauseVideo;

        setTimeout(() => {
            this.webref.injectJavaScript(`player.seekTo(${this.props.activeVideo.currentTime});`);
            this.webref.injectJavaScript(playerState);
        }, 1500);

        return (
            <View style={{ flex: 1 }}>
                <WebView 
                    pointerEvents="none"
                    javascriptEnabled={true}
                    useWebKit={true}
                    source={{ html }}
                    ref={r => (this.webref = r)}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}
                    onMessage={event => this.onMessageHandler(event.nativeEvent.data)}
                    mediaPlaybackRequiresUserAction={false}
                />
                <View style={styles.rowPlayer}>
                    <MaterialCommunityIcons
                        onPress={this.props.loadPrevVideoToPlayer}
                        name="skip-previous"
                        size={40}
                        color="#fa8072"
                    />
                    <MaterialCommunityIcons
                        onPress={this.onPressPlayPause}
                        name={this.props.condition === 'play' ? "pause-circle" : "play-circle"}
                        size={70}
                        color="#ff6347"
                    />
                    <MaterialCommunityIcons
                        onPress={this.props.loadNextVideoToPlayer}
                        name="skip-next"
                        size={40}
                        color="#fa8072"
                    />
                </View>
            </View>
        )
    }
}

// 'onReady': onPlayerReady,
// function onPlayerReady(event) {
//     event.target.seekTo(${this.props.activeVideo.currentTime});
// }

// function onPlayerStateChange(event) {
//     if(${this.props.isActionMaker} && event.data === YT.PlayerState.PAUSED) {
//         window.ReactNativeWebView.postMessage(player.getCurrentTime());
//     } else if(${this.props.isHost} && event.data === YT.PlayerState.ENDED) {
//         window.ReactNativeWebView.postMessage("ended");
//     }
// }