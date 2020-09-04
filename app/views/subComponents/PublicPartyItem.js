import React from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { styles } from '../../styles/styles';
import { color } from 'react-native-reanimated';

export default class PublicPartyItem extends React.Component {
    constructor(props) {
        super(props);
    }

    joinParty() {
        Alert.alert('Join party ', this.props.name);
        // this.props.navigation.navigate('Party View', {
        //     partyId: this.props.joinId,
        //     isHost: false,
        //     userId: ////////,
        //     playlist: //////,
        //     isInvited: false
        // });
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.joinParty();
                }}>
                <View style={{ ...styles.ActivePlaylistItem, flexDirection: "row", justifyContent: 'space-evenly', height: 60 }}>
                    <Text style={{ flex: 6,position:'relative',left:9, fontSize:16 }}>
                        {this.props.name}
                    </Text>
                    <Text style={{ flex: 6, color: this.props.condition === 'play' ? 'green' : 'red' }}>
                        {this.props.condition}
                    </Text>
                    <Text style={{ flex: 2 }}>
                        {this.props.joinId}
                    </Text>
                </View>

                {/* <View style={this.props.condition === 'play' ? styles.partyItemPlayed : styles.partyItemPaused}>
                    <Text style={{ flex: 6 }}>
                        {this.props.joinId} - {this.props.name}
                    </Text>
                    <Text style={{ flex: 6 }}>
                        status: {this.props.condition}
                    </Text>
                </View> */}
            </TouchableOpacity>
        )
    }
}