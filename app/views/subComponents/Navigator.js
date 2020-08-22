import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PartyView } from '../PartyView.js';
import SetPartyView from '../SetPartyView.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeTab } from '../../tabs/HomeTab.js';
import { PublicPartiesTab } from '../../tabs/PublicPartiesTab.js';
import HistoryTab from '../../tabs/HistoryTab.js';
import { BackButtonHandler } from './AndroidBackHandler.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import PartyTimeTab from '../../tabs/PartyTimeTab.js';
import AddToPlaylistView from '../AddToPlaylistView.js';
import { LoginView } from '../LogjnView.js';
import { SettingsView } from '../SettingsView.js';
import { ParticipantsView } from '../ParticipantsView.js';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default class Navigator extends React.Component {

    MainAppStack = (navigation) => {
        return <Stack.Navigator
            screenOptions={{
                gestureEnabled: false
            }}
            headerMode='none'
        >
            <Stack.Screen name="Login" component={LoginView} 
                initialParams={{ logout: navigation?.route?.params?.logout || false}}
            />
            <Stack.Screen name="Bottom Tabs" component={this.BottomTabs} />
            <Stack.Screen name="Party View" component={PartyView} />
        </Stack.Navigator>
    }

    BottomTabs = (navigation) => {        
        return <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ backgroundColor: '#ff6347' }}
        >
            <Tab.Screen
                name="Home Tab"
                component={HomeTab}
                initialParams={{ loggedInUser: navigation.route.params.loggedInUser }}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={25} />),
                }}
            />
            <Tab.Screen
                name="Public Parties Tab"
                component={PublicPartiesTab}
                options={{
                    tabBarLabel: 'Public Parties',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="playlist-music" color={color} size={25} />),
                }}
            />
            <Tab.Screen
                name="History Tab"
                component={HistoryTab}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="history" color={color} size={25} />),
                }}
            />
            <Tab.Screen
                name="Party Time Tab"
                initialParams={{ loggedInUser: navigation.route.params.loggedInUser }}
                component={this.PartyTabStack}
                options={{
                    tabBarLabel: 'Party Time',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music-circle" color={color} size={25} />),
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate('Party Time Tab');
                    },
                })}
            />
        </Tab.Navigator>
    }

    PartyTabStack = (navigation) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen name="Party Time" component={PartyTimeTab} />
                <Stack.Screen name="Set Party"
                    initialParams={{ loggedInUser: navigation.route.params.loggedInUser }}
                    component={SetPartyView}
                />
                <Stack.Screen name="Party Drawer" component={this.PartyViewDrawer}
                />
                {/* <Stack.Screen name="Party View" component={PartyView}/>
                <Stack.Screen name="Add To Playlist" component={AddToPlaylistView}/> */}
            </Stack.Navigator >
        )
    }

    PartyViewDrawer = (navigation) => {
        return (
            <Drawer.Navigator
                drawerPosition="left"
                drawerType="front"
                drawerStyle={{ width: 180 }}
            >
                <Drawer.Screen name="Party View Stack" component={this.PartyViewStack}
                    initialParams={{
                        loggedInUser: navigation.route.params.loggedInUser,
                        userId: navigation.route.params.userId,
                        partyId: navigation.route.params.partyId,
                        isHost: navigation.route.params.isHost,
                        playlist: navigation.route.params.playlist,
                        isInvited: navigation.route.params.isInvited,

                    }}
                    options={{
                        drawerLabel: 'Party',
                        drawerIcon: ({ size }) => (
                            <MaterialCommunityIcons
                                name="music-box-outline"
                                size={size}
                            />
                        )
                    }}
                />
                <Drawer.Screen name="Participants View" component={ParticipantsView}
                    initialParams={{
                        participants: navigation.route.params.participants,
                        loggedInUser: navigation.route.params.loggedInUser,

                    }}
                    options={{
                        drawerLabel: 'Participants',
                        drawerIcon: ({ size }) => (
                            <MaterialCommunityIcons
                                name="account-multiple"
                                size={size}
                            />
                        )
                    }}
                />
                <Drawer.Screen name="Settings View" component={SettingsView}
                    options={{
                        drawerLabel: 'Settings',
                        drawerIcon: ({ size }) => (
                            <Ionicons
                                name="ios-settings"
                                size={size}
                            />
                        )
                    }}
                />
            </Drawer.Navigator>
        );
    }

    PartyViewStack = (navigation) => {
        return (
            <Stack.Navigator headerMode='none'>
                <Stack.Screen name="Party View" component={PartyView}
                    initialParams={{
                        userId: navigation.route.params.userId,
                        partyId: navigation.route.params.partyId,
                        isHost: navigation.route.params.isHost,
                        playlist: navigation.route.params.playlist,
                        isInvited: navigation.route.params.isInvited,
                        loggedInUser: navigation.route.params.loggedInUser
                    }}
                />
                <Stack.Screen name="Add To Playlist" component={AddToPlaylistView} />
            </Stack.Navigator>
        )
    }


    render() {
        return (
            <NavigationContainer>
                {/* <BackButtonHandler/>  */}
                {this.MainAppStack()}
            </NavigationContainer>
        )
    }
}





/* 
Use this to fix error:
1. "Unable to resolve module ./components/Checkbox from node_modules\react-native-paper\lib\module\index.js"
2. Unable to resolve "./NavigationNativeContainer" from "node_modules/@react-navigation/native/src/index.tsx"

npx react-native start --reset-cache
npm install
*/