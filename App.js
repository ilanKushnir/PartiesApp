import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import { Home } from './app/views/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Details} from "./app/views/Details";
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import{View,Text} from 'react-native';

const HomeStack = createStackNavigator({
  Home:{
    screen: Home,
  },
  Details:{
    screen: Details,
  }  

},
);
const Tab = createBottomTabNavigator();


function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

export default class App extends React.Component {
   render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Details" component={SettingsScreen}/>
        <Tab.Screen name = "New Party" component={HomeScreen}/>
        <Tab.Screen name = "Join Party" component={SettingsScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    )
   }
}


    