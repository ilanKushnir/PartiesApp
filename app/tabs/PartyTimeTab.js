import React from 'react'
import { View, Button, Text,TouchableOpacity } from 'react-native'
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default class PartyTimeTab extends React.Component {
    render() {
        return(
            <View style={styles.center,styles.row}>
                <View style={styles.column}>
                    <MaterialCommunityIcons 
                        onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: true})}
                        name="play-circle"
                        size={60}
                        color="#6495ed"
                    >
                    </MaterialCommunityIcons>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: true})}>
                        <Text style={{ fontSize: 15 }}>Start New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.column}>
                    <MaterialCommunityIcons 
                        onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: false})}
                        name="account-plus"
                        size={60}
                        color="#6495ed"
                    >
                    </MaterialCommunityIcons>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: false})}>
                                            <Text style={{ fontSize: 15 }}>Join</Text>
                    </TouchableOpacity>
                 </View>
            </View>
        )
    }
}