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
            participants: props.route.params.participants
            
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
        await this.db.collection('party').doc(this.state.partyId).update({
            participants: this.state.participants
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
                const {participants} = data;

                this.setState({
                   participants
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
            { id: 0, label: 'HOST' },
            { id: 1, label: 'DJ' },
            { id: 2, label: 'GUEST' }
        ];

        return (
            <View style={styles.ParticipantItem} >
                <Text>{item.name + '-' + item.permission} </Text>
                {
                    this.props.route.params.loggedInUser.permission === 'HOST' &&
                    (this.state.changePermission && this.state.changePermissionIndex === index ?
                        <View style={{ flexDirection: 'row' }}>
                            <RadioGroup
                                options={radiogroup_options}
                                onChange={(option) => this.changePermission(option.label, item.id)}
                                horizontal={true}
                                activeButtonId={radiogroup_options.filter(option => option.label === item.permission)[0].id}
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
                            <Text>
                                Change Permission
                        </Text>
                        </TouchableOpacity>)
                }
            </View>
        );
    };


    render() {
        return (
            <SafeAreaView style={{ position: 'relative' }}>
                <View style={{ height: 50, flexDirection: 'row' }}>
                    <View style={{ left: 10 }} >
                        <MaterialCommunityIcons
                            onPress={() => this.props.navigation.openDrawer()}
                            name="menu"
                            size={30}
                            color="#696969"
                        />
                    </View>
                    <View style={{
                        alignItems: "center",
                        alignSelf: 'center'
                    }}>
                        <Text style={styles.title}>Participants</Text>
                    </View>
                </View>
                <FlatList
                    data={this.state.participants}
                    renderItem={this.renderParticipantItem}
                    keyExtractor={(item) => item.id}
                />
            </SafeAreaView>
        );
    }
}
