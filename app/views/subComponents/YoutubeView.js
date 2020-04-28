import React from 'react';
import { WebView } from 'react-native-webview';

export default class YoutubeView extends React.Component {
    constructor(props) {
        super(props);
    
    }

    currentTimeHandler(currentTime) {
        console.log(currentTime);
        this.setState( {
            activeVideo : {id: this.props.activeVideo.id, currentTime: currentTime}
        });
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
                            'onReady': onPlayerReady
                        }
                    });
                }

                let play = ${this.props.condition === 'play'};
                let currentTime = ${this.props.activeVideo.currentTime};
                function onPlayerReady(event) {
                    if(play) {
                        event.target.seekTo(currentTime, false);
                        event.target.playVideo();
                    }
                }

               setInterval(()=> {
                window.ReactNativeWebView.postMessage(player.getCurrentTime())
               },5000);
               
               </script>
            </body>
            </html>`;

        let playerState = this.props.condition === 'play' ? `player.playVideo();` : `player.pauseVideo();`

        setTimeout(() => {
            this.webref.injectJavaScript(playerState);
        }, 0);

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