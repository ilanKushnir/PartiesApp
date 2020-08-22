import React from 'react';
import { View, Text, Switch } from 'react-native';
import { styles } from '../../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

export class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPublic: this.props.isPublic
        }
    }

    toggleIsPublic = (isPublic) => this.props.setIsPublic(isPublic);

    setPartyMode = chosenPartyMode => this.props.setPartyMode(chosenPartyMode);

    render() {
        return (
            <View style={{ flex: 0.3 }}>
                <View style={{ ...styles.row, ...styles.publicSwitch }}>
                    <Text>Public</Text>
                    <Switch
                        value={this.state.isPublic}
                        onValueChange={this.toggleIsPublic}
                        thumbColor={this.state.isPublic ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        trackColor={{ false: "#767577", true: "#ff7752" }}
                    />
                </View>
                <View style={styles.partyModePicker}>
                    <DropDownPicker
                        items={[
                            { label: 'View Only', value: 'viewOnly', icon: () => <Icon name="music" size={18} color="#900" /> },
                            { label: 'Friendly', value: 'friendly', icon: () => <Icon name="music" size={18} color="#900" /> },
                        ]}
                        placeholder="Select Party Mode "

                        containerStyle={{ height: 40, width: 180, marginTop: 10, marginBottom: 10 }}
                        style={{ backgroundColor: '#fafafa' }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => this.setPartyMode(item.value)}
                    />
                </View>
            </View>
        )
    }
}
