import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { slide as Menu } from 'react-burger-menu'
import { Button } from 'react-native-paper';

export default class ParticipantsView extends React.Component {
    constructor(props) {
        super(props);
    }


    changePermission(participantName, newPermission) {
        this.props.participants;
    }

    renderParticipantItem = ({ participantItem }) => {
        return (
            <View>
                <View Text={participantItem.name} style={{ flexDirection: 'row' }}> </View>
                <Menu
                    customCrossIcon={
                        <MaterialCommunityIcons
                            name="menu"
                            size={30}
                            color="#ff4d4d"
                        >
                        </MaterialCommunityIcons>
                    }>
                    <Button disabled={participantItem.Permission === 'Host'} onPress={this.changePermission(participantItem.name, 'Host')} id="makeHost" Text={'Make Host'} />
                    <Button disabled={participantItem.Permission === 'DJ'} onPress={this.changePermission(participantItem.name, 'DJ')} id="makeDJ" Text={'Make DJ'} />
                    <Button disabled={participantItem.Permission === 'Guest'} onPress={this.changePermission(participantItem.name, 'Guest')} id="makeGuest" Text={'Make Guest'} />
                </Menu>
            </View>

        );
    };

    render() {
        return (
            <SafeAreaView>
                <FlatList
                    data={this.props.participants}
                    renderItem={renderParticipantItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
            </SafeAreaView>
        );
    }
}