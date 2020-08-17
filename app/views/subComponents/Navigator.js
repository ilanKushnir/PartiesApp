import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { PartyView } from '../PartyView.js';
import SetPartyView from '../SetPartyView.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeTab } from '../../tabs/HomeTab.js';
import TopPlaylistsTab from '../../tabs/TopPlaylistsTab.js';
import HistoryTab from '../../tabs/HistoryTab.js';
import { BackButtonHandler } from './AndroidBackHandler.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PartyTimeTab from '../../tabs/PartyTimeTab.js';
import AddToPlaylistView from '../AddToPlaylistView.js';
import { LoginView } from '../LogjnView.js';
import { ParticipantsView } from '../ParticipantsView.js';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default class Navigator extends React.Component {

    createMainAppStack = (navigation) => {
        return <Stack.Navigator
            screenOptions={{
                gestureEnabled: false
            }}
            headerMode='none'
        >
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen name="Bottom Tabs" component={this.createBottomTabs} />
            <Stack.Screen name="Party View" component={PartyView} />
        </Stack.Navigator>
    }

    createBottomTabs = (navigation) => {
        return <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ backgroundColor: '#ff6347' }}
        >
            <Tab.Screen
                name="Home Tab"
                component={HomeTab}
                initialParams={{ username: navigation.route.params.username }}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={25} />),
                }}
            />
            <Tab.Screen
                name="Top Playlists Tab"
                component={TopPlaylistsTab}
                options={{
                    tabBarLabel: 'Top Playlists',
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
                component={this.createPartyTabStack}
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

    createPartyTabStack = (navigation) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen name="Party Time" component={PartyTimeTab} />
                <Stack.Screen name="Set Party" component={SetPartyView} />
                <Stack.Screen name="Party Drawer" component={this.createPartyViewDrawer}
                />
                {/* <Stack.Screen name="Party View" component={PartyView}/>
                <Stack.Screen name="Add To Playlist" component={AddToPlaylistView}/> */}
            </Stack.Navigator >
        )
    }

    createPartyViewDrawer = (navigation) => {
        return (
            <Drawer.Navigator
                drawerPosition="left"
                drawerType="front"
                drawerStyle={{ width: 180 }}
            >
                <Drawer.Screen name="Party View Stack" component={this.createPartyViewStack}
                    initialParams={{
                        userId: navigation.route.params.userId,
                        partyId: navigation.route.params.partyId,
                        isHost: navigation.route.params.isHost,
                        playlist: navigation.route.params.playlist,
                        isInvited: navigation.route.params.isInvited
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
            </Drawer.Navigator>
        );
    }

    createPartyViewStack = (navigation) => {
        return (
            <Stack.Navigator headerMode='none'>
                <Stack.Screen name="Party View" component={PartyView}
                    initialParams={{
                        userId: navigation.route.params.userId,
                        partyId: navigation.route.params.partyId,
                        isHost: navigation.route.params.isHost,
                        playlist: navigation.route.params.playlist,
                        isInvited: navigation.route.params.isInvited
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
                {this.createMainAppStack()}
            </NavigationContainer>
        )
    }
}