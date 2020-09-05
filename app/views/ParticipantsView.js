import React from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import { slide as Menu } from 'react-burger-menu'
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from '../styles/styles.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonGroup from 'react-native-button-group';
import RadioGroup from 'react-native-radio-button-group';
import { color } from 'react-native-reanimated';
import firebase from '../../firebase';
import { DB_TABLES, USER_PERMISSION } from '../../assets/utils';


export class ParticipantsView extends React.Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();
        console.log(props.route.params.participants);
        this.state = {
            changePermission: false,
            partyId: props.route.params.partyId,
            partyMode: props.route.params.partyMode,
            participants: props.route.params.participants.filter(participant => participant.id !== this.props.route.params.loggedInUser.id),
            loggedInUser: this.props.route.params.loggedInUser,

            // participants: [{
            //     "id": "1",
            //     "name": "DekelDekelDekelDekelDekelDekelDekelDekelDekel",
            //     "permission": "HOST",
            // },
            // {
            //     "id": "2",
            //     "name": "Ofir",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "3",
            //     "name": "Amit",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "4",
            //     "name": "Ilan",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "5",
            //     "name": "Tomer",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "6",
            //     "name": "Ohad",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "7",
            //     "name": "Or",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "8",
            //     "name": "Maya",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "9",
            //     "name": "Shira",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "10",
            //     "name": "Yuval",
            //     "permission": "Guest",
            // },
            // {
            //     "id": "11",
            //     "name": "Sam",
            //     "permission": "Guest",
            // },

            // ]
            // participants: [{
            //     "id": "1",
            //     "name": "DEKEL",
            //     "permission": "HOST",
            // },
            // {
            //     "id": "2",
            //     "name": "OFIR",
            //     "permission": "GUEST",
            // },
            // {
            //     "id": "3",
            //     "name": "AMIT",
            //     "permission": "DJ",
            // },
            // {
            //     "id": "4",
            //     "name": "Ilan",
            //     "permission": "GUEST",
            // },
            // {
            //     "id": "5",
            //     "name": "TOMER",
            //     "permission": "GUEST",
            // },
            // {
            //     "id": "6",
            //     "name": "OHAD",
            //     "permission": "GUEST",
            // }]
        };
    }

    updateParticipantsPermissionsInDb = async () => {
        let participants = this.state.participants;
        participants.push({
            id: this.state.loggedInUser.id,
            name: this.state.loggedInUser.name,
            permission: this.state.loggedInUser.permission
        });
        await this.db.collection('party').doc(this.state.partyId).update({
            participants: participants
        });
    }

    componentWillUnmount() {
        this.dbbindingResponse();
    }

    async componentDidMount() {
        try {
            // bind party continues updates from DB to this component
            await this.bindParticipantsFromDB();
        } catch (error) {
            console.log(error);
        }
    }
    bindParticipantsFromDB = async () => {
        try {
            this.dbbindingResponse = await this.db.collection(DB_TABLES.PARTY).doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                const { participants } = data;

                this.setState({
                    participants: participants.filter(participant => participant.id !== this.props.route.params.loggedInUser.id)
                });
            })
        } catch (error) {
            console.log('bindParticipants changes From DB error', error)
            Alert.alert(`Error getting updates from party #${this.state.party.joinId}`);
        }
    }


    changePermission(newPermission, participantId) {

        let updatedParticipants = this.state.participants.map(participant => {

            if (participant.id === participantId) {
                participant.permission = newPermission;
            }
            return participant;
        });

        this.setState({ selectedOption: newPermission, changePermissionIndex: -1, participants: updatedParticipants });
        this.updateParticipantsPermissionsInDb();
    }

    renderParticipantItem = ({ item, index }) => {
        var radiogroup_options = [
            { id: 1, label: 'DJ' },
            { id: 2, label: 'GUEST' }
        ];

        return (

            <View style={{ ...styles.ParticipantItem }} >
                <View style={{ flexDirection: 'row' }}>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', maxWidth: 130, maxHeight: 50 }}>{item.name} </Text>
                    <Text>{'(' + item.permission + ')'} </Text>
                </View>
                {
                    this.state.loggedInUser.permission === 'HOST' &&
                    (this.state.changePermission && this.state.changePermissionIndex === index ?
                        <View style={{ flexDirection: 'row' }}>
                            <RadioGroup
                                options={radiogroup_options}
                                onChange={(option) => this.changePermission(option.label, item.id)}
                                horizontal={true}
                                activeButtonId={radiogroup_options.filter(option => option.label === item.permission[0] ? option.label === item.permission[0].id : null)}
                            />
                            <TouchableOpacity
                                style={{ height: 32, position: 'relative', top: 4 }}
                                onPress={() => {
                                    this.setState({
                                        changePermission: false
                                    });
                                }}>
                                <Text style={{ color: 'red' }}>
                                    Cancel
                                 </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            style={{ height: 32 }}
                            onPress={() => {
                                this.setState({
                                    changePermission: true,
                                    changePermissionIndex: index
                                });
                            }}>
                            <Text style={{ color: '#ff7752', fontSize: 15, paddingRight: 5 }}>
                                Change Permission
                        </Text>
                        </TouchableOpacity>)
                }
            </View>
        );
    };


    render() {
        return (
            <SafeAreaView style={{ position: 'relative', ...styles.appBackgroundColor,flex:1 }}>
                <View style={{
                    height: 50, flexDirection: 'row', position: 'relative', top: 12, marginBottom: 15, alignSelf: 'stretch'
                }}>
                    <View style={{ left: 10, flex: 1 }} >
                        <MaterialCommunityIcons
                            onPress={() => this.props.navigation.openDrawer()}
                            name="menu"
                            size={30}
                            color='#ff7752'
                        />
                    </View>
                    <View style={{ left: 10, flex: 2 }}>
                        <Text style={{
                            fontSize: 24,
                            marginBottom: 16
                        }}>Participants</Text>
                    </View>
                </View>
                <View style={{ ...styles.appBackgroundColor }}>
                    <FlatList
                        style={{ ...styles.appBackgroundColor }}
                        data={this.state.participants}
                        renderItem={this.renderParticipantItem}
                        keyExtractor={(item) => item.id}
                    />
                    {/* <View style={{ ...styles.appBackgroundColor,height:1000,zIndex:-1}}>
                    </View> */}
                </View>
            </SafeAreaView>
        );
    }
}
