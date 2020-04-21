import React from 'react'
import { View, Button, Text } from 'react-native'
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class GoParty extends React.Component {
    render() {
        return(
            <View style={styles.center,styles.row}>
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



    {/* <View>
    <MaterialCommunityIcons 
        onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: true})}
        name="play-circle"
        size="50"
        color="#0000ff"
    >
    </MaterialCommunityIcons>
    <Text style={{ fontFamily: 'Arial', fontSize: 15 }}>Start New</Text>
    </View>
    <View>
    <MaterialCommunityIcons 
        onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: false})}
        name="account-plus"
        size="50"
        color="#0000ff"
    >
    </MaterialCommunityIcons>
    <Text style={{ fontFamily: 'Arial', fontSize: 15 }}>Join</Text>
    </View> */}