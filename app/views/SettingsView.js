import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/styles.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SettingsComponent } from './subComponents/SettingsComponent.js';

export class SettingsView extends React.Component {

    render() {
        return (
            <View style={{flex:1}}>
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
                <View style={{...styles.center,flex:4,justifyContent:'space-between'}}>
                    <SettingsComponent isHost={this.props.isHost}/>
                </View>
            </View>
        )
    }
}

