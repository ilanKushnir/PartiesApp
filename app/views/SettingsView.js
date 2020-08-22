import React from 'react';
import { View, Text, Switch, Button } from 'react-native';
import { styles } from '../styles/styles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import firebase from '../../firebase';

import { DB_TABLES, USER_PERMISSION, PARTY_MODES } from '../../assets/utils'; 

export class SettingsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHost: props.route.params.isHost,
            partyId: props.route.params.partyId,
            isPublic: false,
            partyMode: '',
            participants: []
        }
        this.db = firebase.firestore();
    }

    bindPartyChangesFromDB = async () => {
        try {
            this.dbbindingResponse = await this.db.collection('party').doc(this.state.partyId).onSnapshot(snapshot => {
                const data = snapshot.data();
                const { isPublic, partyMode, participants } = data;

                this.setState({
                    isPublic,
                    partyMode,
                    participants
                });
            })

            // TODO - when distructing component --> call DBbindingResponse() to unbind it from DB
        } catch (error) {
            console.log('bindChanges changes From DB error', error)
        }
    }

    async componentDidMount() {
        try {
            // bind settings continues updates from DB to this component
            await this.bindPartyChangesFromDB();
        } catch (error) {
            console.log(error);
        }
    }

    updatePermissions = (partyMode) => {
        let participants = this.state.participants.map(user => {
            if (user.permission !== USER_PERMISSION.HOST) {
                user.permission = partyMode === PARTY_MODES.VIEW_ONLY ? USER_PERMISSION.GUEST : USER_PERMISSION.DJ;
            }
            return user;
        });
        this.setState({
            partyMode,
            participants: participants
        })
    }

    updateSettingsInDB = async () => {
        await this.db.collection('party').doc(this.state.partyId).update({
            isPublic: this.state.isPublic,
            partyMode: this.state.partyMode,
            participants: this.state.participants
        });
    }

    render() {
        return (
            <View style={{ flex: 0.9 }}>
                <View style={styles.row}>
                    <View style={{ position: 'relative', left: 10 }} >
                        <MaterialCommunityIcons
                            onPress={() => this.props.navigation.openDrawer()}
                            name="menu"
                            size={30}
                            color="#696969"
                        />
                    </View>
                    <View style={{ ...styles.center }}>
                        <Text style={styles.title}>Settings</Text>
                    </View>
                </View>
                <View style={{ ...styles.center, flex: 4}}>
                    <View style={{ ...styles.row, ...styles.publicSwitch, flex: 0.2 }}>
                        <Text>Public</Text>
                        <Switch
                            value={this.state.isPublic}
                            onValueChange={isPublic => this.setState({ isPublic })}
                            thumbColor={this.state.isPublic ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            trackColor={{ false: "#767577", true: "#ff7752" }}
                            disabled={!this.state.isHost}
                        />
                    </View>
                    <View style={styles.partyModePicker}>
                        <DropDownPicker
                            items={[
                                { label: 'View Only', value: PARTY_MODES.VIEW_ONLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                                { label: 'Friendly', value: PARTY_MODES.FRIENDLY, icon: () => <Icon name="music" size={18} color="#900" /> },
                            ]}
                            placeholder="Select Party Mode "

                            containerStyle={{ height: 40, width: 180, marginTop: 10, marginBottom: 10 }}
                            style={{ backgroundColor: '#fafafa' }}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            dropDownStyle={{ backgroundColor: '#fafafa' }}
                            onChangeItem={item => this.updatePermissions(item.value)}
                            disabled={!this.state.isHost}
                            defaultValue={this.state.partyMode}
                        />
                    </View>
                    <View style={{ position: 'absolute', bottom: 40 }}>
                        <Button
                            onPress={this.updateSettingsInDB}
                            title="Save"
                            disabled={false}//
                        />
                    </View>
                </View>
            </View>
        )
    }
}

