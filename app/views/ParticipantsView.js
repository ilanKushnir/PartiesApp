import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { slide as Menu } from 'react-burger-menu'
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export class ParticipantsView extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.route.params.participants);
    }

    changePermission(participantName, newPermission) {
    }

    renderParticipantItem = ({ item }) => {
        console.log('render psrticipant', item);
        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Text>{item.name} </Text>
                </View>
                {/* <Menu
                    customCrossIcon={
                        <MaterialCommunityIcons
                            name="menu"
                            size={30}
                            color="#ff4d4d"
                        >
                        </MaterialCommunityIcons>
                    }>
                    <Button disabled={item.Permission === 'Host'} onPress={this.changePermission(item.name, 'Host')} id="makeHost" Text={'Make Host'} />
                    <Button disabled={item.Permission === 'DJ'} onPress={this.changePermission(item.name, 'DJ')} id="makeDJ" Text={'Make DJ'} />
                    <Button disabled={item.Permission === 'Guest'} onPress={this.changePermission(item.name, 'Guest')} id="makeGuest" Text={'Make Guest'} />
                </Menu> */}
            </View>

        );
    };

    render() {
        return (
            <SafeAreaView>
                <FlatList
                    data={this.props.route.params.participants}
                    renderItem={this.renderParticipantItem}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        );
    }
}
