import React from 'react';
import {View, Text,StyleSheet} from 'react-native';

export class Home extends React.Component {
static navigationOptions = {
    headerShown: false
};

    render(){
        return (
            <View style= {styles.container}>
                <Text>test</Text>
            </View>
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