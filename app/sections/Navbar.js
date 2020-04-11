import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer} from '@react-navigation/native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import BottomNavigation, {
    IconTab,
    Badge
  } from 'react-native-material-bottom-navigation';

const Tab = createMaterialBottomTabNavigator();

export class NavBar extends React.Component {
    state = {
        activeTab: ''
      }
    
    tabs = [
        {
          key: 'NewParty',
          label: 'New Party',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)',
          icon: 'gamepad-variant'
        },
        {
          key: 'JoinParty',
          label: 'Join Party',
          barColor: '#00695C',
          pressColor: 'rgba(255, 255, 255, 0.16)',
          icon: 'movie'
        },
        {
          key: 'MyPlaylists',
          label: 'My Playlists',
          barColor: '#6A1B9A',
          pressColor: 'rgba(255, 255, 255, 0.16)',
          icon: 'music-note'
        },
        {
          key: 'Friends',
          label: 'Friends',
          barColor: '#1565C0',
          pressColor: 'rgba(255, 255, 255, 0.16)',
          icon: 'book'
        },
        {
          key: 'Explore',
          label: 'Explore',
          barColor: '#1565C0',
          pressColor: 'rgba(255, 255, 255, 0.16)',
          icon: 'book'
        }
     ]

    state = {
        activeTab: this.tabs[0].key
      };

    renderIcon = icon => ({ isActive }) => (
        <MaterialCommunityIcons size={24} color="white" name={icon} />
     );
    
    renderTab = ({ tab, isActive }) => (
      <IconTab
        isActive={isActive}
        renderBadge={() => <Badge>2</Badge>}
        key={tab.key}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
      />
    )

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