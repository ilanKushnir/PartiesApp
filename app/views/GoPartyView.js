import React from 'react'
import { View, Button, Text } from 'react-native'
import { styles } from '../styles/styles.js'

export default class GoParty extends React.Component {
    render() {
        return(
            <View style={styles.center}>
                <Button 
                    style={styles.title} 
                    onPress= {() => this.props.navigation.navigate('Set Party', {isNewParty: true})}
                    title="Start New Party"
                />
                <Button 
                    style={styles.title} 
                    onPress= {() => this.props.navigation.navigate('Set Party', {isNewParty: false})}
                    title="Join Party"
                />
            </View>
        )
    }
}