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
                            
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }

                function onPlayerStateChange(event) {
                    if (${this.props.isHost} && event.data == YT.PlayerState.PAUSED) {
                        window.ReactNativeWebView.postMessage(player.getCurrentTime())
                    }
                }

               </script>
            </body>
            </html>`;

        let playerState = this.props.condition === 'play' ? 
                            `player.seekTo(${this.props.activeVideo.currentTime});
                            player.playVideo();` : `player.pauseVideo();`

        setTimeout(() => {
            this.webref.injectJavaScript(playerState);
        }, 10);

        return (
            <WebView
                javascriptEnabled={true}
                useWebKit={true}
                source={{ html }}
                ref={r => (this.webref = r)}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                onMessage={event => {
                    this.currentTimeHandler(event.nativeEvent.data)}}
            />
        )
    }
}

// 'onReady': onPlayerReady,

// function onPlayerReady(event) {
//     if(${this.props.condition === 'play'}) {
//         event.target.seekTo(${this.props.activeVideo.currentTime});
//         event.target.playVideo();
//     }
// }

// setInterval(()=> {
//     window.ReactNativeWebView.postMessage(player.getCurrentTime())
// },2000);

// setTimeout(() => {
//     if(${this.props.condition === 'play'} && ${this.state.joinedNow}) {
//         player.seekTo(${this.props.activeVideo.currentTime});
//         player.playVideo();
//     }
// },1000);