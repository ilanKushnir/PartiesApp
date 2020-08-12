import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { styles } from '../../styles/styles.js';
import Player from './Player.js';

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

        console.log('render youtubeView');

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
                    if(${this.props.isHost} && event.data === YT.PlayerState.ENDED) {
                        window.ReactNativeWebView.postMessage("ended");
                    }
                }

               </script>
            </body>
            </html>`;

        let onLoadEndScript = this.props.condition === 'play' ? playVideo : pauseVideo;

        return (
            <View style={{ flex: 1 }}>
                <WebView style={{ flex: 1 }}
                    pointerEvents="none"
                    javascriptEnabled={true}
                    useWebKit={true}
                    source={{ html }}
                    ref={r => (this.webref = r)}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}
                    onMessage={event => this.onMessageHandler(event.nativeEvent.data)}
                    mediaPlaybackRequiresUserAction={false}
                    onLoadEnd={() => this.webref.injectJavaScript(onLoadEndScript)}
                />
                <Player style={styles.rowPlayer}
                    loadPrevVideoToPlayer={this.props.loadPrevVideoToPlayer}
                    loadNextVideoToPlayer={this.props.loadNextVideoToPlayer}
                    onPressPlayPause={this.onPressPlayPause}
                    condition={this.props.condition}
                />
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


// setTimeout(() => {
//     this.webref.injectJavaScript(`player.seekTo(${this.props.activeVideo.currentTime});`);
//     this.webref.injectJavaScript(playerState);
// }, 1500);