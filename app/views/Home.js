import React from 'react';
import {View, Text,StyleSheet,Button} from 'react-native';

export class Home extends React.Component {
static navigationOptions = {
    headerShown: false
};

    render(){
        return (
            <View style= {styles.container}>
                <Text>This is the home screen</Text>
                <Button title="Go to Details"
                    onPress={() => navigation.navigate('Details')}></Button>
            </View>
        )
    }
}
const styles = StyleSheet.create ({
container: {
    flex:1,
    backgroundColor: '#f0f',
    alignItems: 'center',
    justifyContent: 'center'
},
})