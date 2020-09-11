import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PartyView } from '../views/partyTab/PartyView.js';
import SetPartyView from '../views/partyTab/SetPartyView.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeTab } from '../tabs/HomeTab.js';
import { PublicPartiesTab } from '../tabs/PublicPartiesTab.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import PartyTimeTab from '../tabs/PartyTimeTab.js';
import AddToPlaylistView from '../views/partyTab/playlist/AddToPlaylistView.js';
import { LoginView } from '../views/LoginView.js';
import { SettingsView } from '../views/partyTab/SettingsView.js';
import { ParticipantsView } from '../views/partyTab/ParticipantsView.js';
import { styles } from '../styles/styles.js';

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
                initialParams={{ logout: navigation?.route?.params?.logout || false }}
            />
            <Stack.Screen name="Bottom Tabs" component={this.BottomTabs} />
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
                initialParams={{ loggedInUser: navigation.route.params.loggedInUser }}
                options={{
                    tabBarLabel: 'Public Parties',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="playlist-music" color={color} size={25} />),
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
        const isPublicOrInvitation = navigation?.route?.params?.partyId;
        let initialParams = null;

        if(isPublicOrInvitation) {
            initialParams = { 
                loggedInUser: navigation.route.params.loggedInUser || null,
                partyId: navigation.route.params.partyId || null,
                playlist: navigation.route.params.playlist || null,
                isInvited: navigation.route.params.isInvited || null,
                participants: navigation.route.params.participants || null,
                };
        }

        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen name="Party Time" component={PartyTimeTab}
                    initialParams={initialParams || null}
                />
                <Stack.Screen name="Set Party"
                    initialParams={{ loggedInUser: navigation.route.params.loggedInUser }}
                    component={SetPartyView}
                />
                <Stack.Screen name="Party Drawer" component={this.PartyViewDrawer} />
            </Stack.Navigator >
        );
    }

    PartyViewDrawer = (navigation) => {
        return (
            <Drawer.Navigator
                drawerStyle={{ ...styles.appBackgroundColor }}
                drawerPosition="left"
                drawerType="front"
                drawerStyle={{ width: 180,...styles.appBackgroundColor }}
            >
                <Drawer.Screen name="Party View Stack" component={this.PartyViewStack}
                    initialParams={{
                        loggedInUser: navigation.route.params.loggedInUser,
                        partyId: navigation.route.params.partyId,
                        playlist: navigation.route.params.playlist,
                        isInvited: navigation.route.params.isInvited,
                        participants: navigation.route.params.participants
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
                        partyId: navigation.route.params.partyId,
                        partyMode: navigation.route.params.partyMode,
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
                    initialParams={{
                        isHost: navigation.route.params.loggedInUser.permission === "HOST",
                        partyId: navigation.route.params.partyId,
                    }}
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
                {this.MainAppStack()}
            </NavigationContainer>
        )
    }
}
