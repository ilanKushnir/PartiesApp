import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Keyboard, Alert, Image } from 'react-native';
import { styles } from "../styles/styles.js";
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../firebase'

const IOS_CLIENT_ID = '22817374367-gqqgkjaur5fhjn8egj4d4liq83fhi8sa.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '22817374367-blt4tbifsjft1f76mn0rehdnmu7lvsir.apps.googleusercontent.com';


export class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remmemberLogin: false
        }
        this.db = firebase.firestore();

        this.login = this.login.bind(this);
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    componentDidMount = async () => {
        const userID = await this.getLoginFromDevice();
        if(userID) {
            console.log('Trying login to last user from device storage');
            
            const user = await this.db.collection('user').doc(userID).get();
            if(user.exists) {

                this.setState({remmemberLogin: true})
                const data = user.data();
                const { userName } = data;
                console.log('succeded login to ', userName);
                Alert.alert('Success login recent user', userName);
                
                this.props.navigation.navigate("Bottom Tabs", { username: userName });
            }
        }
    }

    saveLoginToDevice = async (userID) => {
        try {
            await AsyncStorage.setItem('USER_ID', userID)
        } catch (error) {
            console.log(error);
        }
    }

    getLoginFromDevice = async () => {
        try {
          const userID = await AsyncStorage.getItem('USER_ID')
          return userID;
        } catch(error) {
            console.log('ex', error); 
        }
      }

    login = async () => {
        Keyboard.dismiss();
        const { userName, password } = this.state;
        console.log('on login', userName);

        try {
            const response = await this.db.collection('user').where('userName', '==', userName).limit(1).get();
            const user = response.docs[0];
            let id
            if (user) {    // if user already exist on DB
                id = user.id;
                const data = user.data();
                const { password: correctPassword } = data;
                if(correctPassword !== password) {
                    Alert.alert(`Wrong Password for user ${userName}`)
                    return;
                } 
                console.log('exist user', data.userName, 'id ', id);
            } else {     //  else create a new user
                const userResponse = await this.db.collection('user').add({
                    userName,
                    password,
                    joinTime: new Date(),
                    savedPlaylists: []
                });

                id = userResponse.id;
                console.log('Created new user', userName, 'id ', id);
            }

            await this.saveLoginToDevice(id);
            this.props.navigation.navigate("Bottom Tabs", { username: userName });
        } catch (error) {
            console.log('Error login in to ', userName);
            Alert.alert(`Error login in to ${userName}`);
        }
    }

    signInWithGoogle = async () => {
        try {            
            const result = await Google.logInAsync({
                // behavior: 'web',
                androidClientId: ANDROID_CLIENT_ID,
                iosClientId: IOS_CLIENT_ID,
                scopes: ['profile', 'email'],
            });

            console.log('on Google Signin, result', result);

            if (result.type === 'success') {
                const { id, name: userName, email, photoUrl } = result.user;
                const googleID = `GOOGLE:${id}`;

                const user = await this.db.collection('user').doc(googleID).get();
                if(!user.exists) {
                    console.log('Creating new user on firestore:', userName, googleID);
                    await this.db.collection('user').doc(googleID).set({
                        userName,
                        joinTime: new Date(),
                        savedPlaylists: []
                    });
                }

                await this.saveLoginToDevice(googleID);
                this.props.navigation.navigate("Bottom Tabs", { username: userName });
            } else {
                throw new Error();
            }
        } catch (error) {
            const USER_CANCELLED = -3;
            if(error.code === USER_CANCELLED) {
                return;
            } else {
                console.log('Error sign in to Google');
                Alert.alert(`Error sign in to Google`);
            }
        }
    }

    render() {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>Choose your sign in method</Text>
                <TextInput style={styles.input} placeholder="User Name"
                    onChangeText={userName => this.setState({ userName })}
                    />
                <TextInput secureTextEntry={true} style={styles.input} placeholder="Password" 
                    onChangeText={password => this.setState({ password })}
                    />
                <Button style={styles.loginButton} onPress={this.login} title="Sign In"/>

                <TouchableOpacity onPress={this.signInWithGoogle}>
                    <Image style={styles.loginButton} source={require('../../assets/googleSigninButton.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}