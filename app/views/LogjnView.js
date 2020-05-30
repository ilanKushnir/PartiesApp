import React from 'react';
import { View,Text,TextInput,Button,Keyboard } from 'react-native';
import {styles} from "../styles/styles.js";


export class LoginView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.center}>
                <Text style={styles.title}>Enter Your Name</Text>
                <TextInput style={styles.input} placeholder="Name" 
                            onChangeText={inputValue => this.setState({inputValue})}>
                </TextInput>
                <Button
                    onPress={() => {
                        Keyboard.dismiss();
                        this.props.navigation.navigate("Bottom Tabs", {username: this.state.inputValue});
                    }}
                    title="Login"
                ></Button>
            </View>
        )
    }
}
