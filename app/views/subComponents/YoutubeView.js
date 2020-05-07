import React from 'react';
import { WebView } from 'react-native-webview';

export default class YoutubeView extends React.Component {
    constructor(props) {
        super(props);
    }

    currentTimeHandler = (currentTime) => {
        this.props.updateCurrentTimeInDB(currentTime);
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
                    if(player.getPlayerState() == YT.PlayerState.CUED) {
                        event.target.seekTo(${this.props.activeVideo.currentTime});
                    }
                }

                function onPlayerStateChange(event) {
                    if(${this.props.isHost} && event.data == YT.PlayerState.PAUSED) {
                        window.ReactNativeWebView.postMessage(player.getCurrentTime());
                    } 
                }

               </script>
            </body>
            </html>`;


        let playerState = this.props.condition === 'play' ? 
                            `player.playVideo();` : `player.pauseVideo();`

        setTimeout(() => {
            this.webref.injectJavaScript(playerState);
        }, 1000);

        return (
            <WebView
                javascriptEnabled={true}
                useWebKit={true}
                source={{ html }}
                ref={r => (this.webref = r)}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                onMessage={event => {
                    console.log(event.nativeEvent.data)}}
                    //this.currentTimeHandler(event.nativeEvent.data)}}
            />
        )
    }
}
