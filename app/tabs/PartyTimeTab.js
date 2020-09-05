import React from 'react'
import { View, Button, Text, TouchableOpacity } from 'react-native'
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class PartyTimeTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        if(this.props?.route?.params?.partyId) {
            const { loggedInUser, partyId, playlist, isInvited, participants } = this.props.route.params;

            this.props.navigation.navigate('Party Drawer', {
                partyId,
                playlist,
                isInvited,
                participants,
                loggedInUser
            });
        }
    }

    render() {
        return (
            <View style={{...styles.center, ...styles.row,...styles.appBackgroundColor}}>
                <View style={styles.column}>
                    <MaterialCommunityIcons
                        onPress={() => this.props.navigation.navigate('Set Party', { isNewParty: true })}
                        name="play-circle"
                        size={60}
                        color="#f24239"
                    >
                    </MaterialCommunityIcons>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Set Party', { isNewParty: true })}>
                        <Text style={{ fontSize: 15 }}>Start New</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.column}>
                    <MaterialCommunityIcons
                        onPress={() => this.props.navigation.navigate('Set Party', { isNewParty: false })}
                        name="account-plus"
                        size={60}
                        color="#f24239"
                    >
                    </MaterialCommunityIcons>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Set Party', { isNewParty: false })}>
                        <Text style={{ fontSize: 15 }}>Join</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}