import React from 'react';
import { View, Text,Switch } from 'react-native';
import { styles } from '../../styles/styles';

export class SettingsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPublic: false
        }
    }

    render() {
        return (
            <View style={styles.row}>
                <Text>Public</Text>
                <Switch
                    value={this.state.isPublic}
                    onValueChange={(isPublic) => this.setState({ isPublic })}
                    thumbColor={this.state.isPublic ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    trackColor={{ false: "#767577", true: "#ff7752" }}
                    style={styles.publicSwitch}
                />
            </View>
        )
    }
}