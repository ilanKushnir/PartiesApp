import React from 'react';
import { WebView } from 'react-native-webview';

export default class YoutubePlayer extends React.Component {
    constructor(props) {
        super(props);
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
                        videoId: '${this.props.videoId}',
                        events: {
                            'onReady': onPlayerReady
                        }
                    });
                }

                let play = ${this.props.condition === 'play'};
                function onPlayerReady(event) {
                    if(play) {
                        event.target.playVideo();
                    }
                }
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
            />
        )
    }
}