import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer} from '@react-navigation/native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import BottomNavigation, {
    IconTab,
    Badge
  } from 'react-native-material-bottom-navigation';

export class NavBar extends React.Component {
    
    renderIcon = icon => ({ isActive }) => (
        <MaterialCommunityIcons size={24} color="white" name={icon} />
     );
    

    render() {

        return (
            <NavigationContainer>
            <BottomNavigation style={styles.container}
            tabs={this.tabs}
            activeTab={this.state.activeTab}
            onTabPress={newTab => this.setState({ activeTab: newTab.key })}
            renderTab={this.renderTab}
            useLayoutAnimation
          />
          </NavigationContainer>
        )
    }
}
const styles = StyleSheet.create ({
    container: {
        
        backgroundColor: '#f0f',
        alignItems: 'center',
        justifyContent: 'center'
    },
})