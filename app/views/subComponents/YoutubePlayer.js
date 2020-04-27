import React from 'react';
import { WebView } from 'react-native-webview';

export default class YoutubePlayer extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    onPlayerReady = event => {
        if(this.props.condition === 'play') {
            event.target.playVideo();
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
                        videoId: '${this.props.videoId}',
                        events: {
                            'onReady': ${this.onPlayerReady}
                        }
                    });
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