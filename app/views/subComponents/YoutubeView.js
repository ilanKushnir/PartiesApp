import React from 'react';
import { WebView } from 'react-native-webview';

export default class YoutubeView extends React.Component {
    constructor(props) {
        super(props);
    }

    onMessageHandler = (data) => {
        if(data === "ended") {
            this.props.loadNextVideoToPlayer();
        } else {
            this.props.updateCurrentTimeInDB(data);
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
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
                
                function onPlayerReady(event) {
                    event.target.seekTo(${this.props.activeVideo.currentTime});
                }

                function onPlayerStateChange(event) {
                    if(${this.props.isActionMaker} && event.data === YT.PlayerState.PAUSED) {
                        window.ReactNativeWebView.postMessage(player.getCurrentTime());
                    } else if(event.data === YT.PlayerState.ENDED) {
                        window.ReactNativeWebView.postMessage("ended");
                    }
                }

               </script>
            </body>
            </html>`;


        let playerState = this.props.condition === 'play' ?
            `player.playVideo();` : `player.pauseVideo();`;

        setTimeout(() => {
            this.webref.injectJavaScript(playerState);
        }, 2000);

        return (
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

        )
    }
}
