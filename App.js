import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {View, Text,StyleSheet} from 'react-native';
import { Home } from './app/views/Home';
import { NavBar } from './app/sections/Navbar';

const Stack = createStackNavigator({
  HomeRT: {
    screen: Home
  },
});

const HomeStack = createAppContainer(Stack);

export default class App extends React.Component {
   render() {
    return (
      <View>
        <HomeStack/>
        <NavBar/>
       </View>
    )
  }
}


    