import React from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { styles } from '../../styles/styles';

export default class PublicPartyItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    // this.props.onClickFunc(this.props.item)
                    Alert.alert('Join party ', this.props.name);
                }}>
                <View style={this.props.condition === 'play' ? styles.partyItemPlayed : styles.partyItemPaused}>
                    <Text style={{ flex: 6 }}>
                        {this.props.joinId} - {this.props.name}
                    </Text>
                    <Text style={{ flex: 6 }}>
                        status: {this.props.condition}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}