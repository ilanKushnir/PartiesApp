import React from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import {styles} from '../../styles/styles.js'

export default class Player extends React.Component {

    render() {
        return (
            <View style={styles.rowPlayer}>
                <MaterialCommunityIcons
                    name="skip-previous"
                    size={40}
                    color="#fa8072"
                />
                <MaterialCommunityIcons
                    onPress={this.props.onPressPlayPause}
                    name={this.props.condition === 'play' ? "pause-circle" : "play-circle"}
                    size={70}
                    color="#ff6347"
                />
                <MaterialCommunityIcons
                    name="skip-next"
                    size={40}
                    color="#fa8072"
                />
            </View>
        )
    }
}