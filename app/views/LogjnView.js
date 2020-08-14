import React from 'react';
import { View,Text,TextInput,Button,Keyboard } from 'react-native';
import {styles} from "../styles/styles.js";

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


export class LoginView extends React.Component {
    constructor(props) {
        super(props);
    }

    onPressLogin = () => {
        Keyboard.dismiss();
        console.log(this.props.route.params);
        //this.props.navigation.navigate("Bottom Tabs", {username: this.state.inputValue});
        // if(this.props)
        // this.props.navigation.navigate("Bottom Tabs", {username: this.state.inputValue});
        
    }

    render() {
        return(
            <View style={styles.center}>
                <Text style={styles.title}>Enter Your Name</Text>
                <TextInput style={styles.input} placeholder="Name" 
                            onChangeText={inputValue => this.setState({inputValue})}>
                </TextInput>
                <Button
                    onPress={this.onPressLogin}
                    title="Login"
                ></Button>
            </View>
        )
    }
}
