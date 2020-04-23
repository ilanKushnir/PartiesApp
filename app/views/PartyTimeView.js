import React from 'react'
import { View, Button, Text } from 'react-native'
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Icon} from 'react-native-vector-icons'

export default class PartyTimeView extends React.Component {
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
                    <Text style={{ fontSize: 15 }}>Start New</Text>
                </View>
                <View style={styles.column}>
                    <MaterialCommunityIcons 
                        onPress={() => this.props.navigation.navigate('Set Party', {isNewParty: false})}
                        name="account-plus"
                        size={60}
                        color="#6495ed"
                    >
                    </MaterialCommunityIcons>
                    <Text style={{ fontSize: 15 }}>Join</Text>
                 </View>
            </View>
        )
    }
}

// return(
        //     <View style={styles.center,styles.row}>
        //         <Button 
        //             style={styles.title} 
        //             onPress= {() => this.props.navigation.navigate('Set Party', {isNewParty: true})}
        //             title="Start New Party"
        //         />
        //         <Button 
        //             style={styles.title} 
        //             onPress= {() => this.props.navigation.navigate('Set Party', {isNewParty: false})}
        //             title="Join Party"
        //         />
        //     </View>
        // )

        