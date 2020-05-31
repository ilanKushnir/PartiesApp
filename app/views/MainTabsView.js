import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HomeTab } from '../tabs/HomeTab.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PartyTimeTab from '../tabs/PartyTimeTab.js'
import AddToPlaylistView from './AddToPlaylistView.js'
import { PartyView } from './PartyView.js'
import SetPartyView from './SetPartyView.js'

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// async login (userName) {
//     console.log('on login');

//     userName = "Kushhhh";
//     const db = firebase.firestore();

//     try {
//       const response = await db.collection('user').where('userName', '==', userName).limit(1).get();
//       const user = response.docs[0];
//       let id
//       if(user) {    // id user already exist on DB
//         id = user.id;
//         const data = user.data();
//         console.log('exist user', data.userName, 'id ', id);

//         return;
//       }

//       //  else create a new user
//       const userResponse = await db.collection('user').add({
//         userName,
//         joinTime: new Date(),
//         savedPlaylists: []
//       });

//       id = userResponse.id;
//       console.log('user', userName, 'id ', id);
//     } catch (error) {
//       console.log('Error login in to ', userName);
//       Alert.alert(`Error login in to ${userName}`);
//     }
//   }

export class MainTabsView extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    createBottomTabs = () => {
        return <Tab.Navigator>
            <Tab.Screen name="Home Tab" component={HomeTab}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={30} />),
                }}
            />
            <Tab.Screen name="New Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: true }}
                options={{
                    tabBarLabel: 'New Party',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
                }}
            />
            <Tab.Screen name="Join Party Tab" component={this.createPartyStack} initialParams={{ isNewParty: false }}
                options={{
                    tabBarLabel: 'Join Party',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
                }}
            />
            <Tab.Screen
                name="Party Time Tab"
                component={this.createPartyTabStack}
                options={{
                    tabBarLabel: 'Party Time',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="music" color={color} size={30} />),
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

    createPartyTabStack = () => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen
                    name="Party Time"
                    component={PartyTimeTab}
                />
                <Stack.Screen
                    name="Set Party"
                    component={SetPartyView}
                />
                <Stack.Screen
                    name="Party View"
                    component={PartyView}
                />
                <Stack.Screen
                    name="Add To Playlist"
                    component={AddToPlaylistView}
                />
            </Stack.Navigator >
        )
    }

    createPartyStack = ({ route }) => {
        return (
            <Stack.Navigator
                screenOptions={{
                    gestureEnabled: false
                }}
                headerMode='none'
            >
                <Stack.Screen
                    name="Set Party"
                    component={SetPartyView}
                    initialParams={{ isNewParty: route.params.isNewParty }}
                />
                <Stack.Screen
                    name="Party View"
                    component={PartyView}
                />
                <Stack.Screen
                    name="Add To Playlist"
                    component={AddToPlaylistView}
                />
            </Stack.Navigator>
        )
    }


    render() {
        return (
            <View>
                {this.createBottomTabs()}
            </View>
        )
    }
}

