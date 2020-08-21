import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Keyboard, Alert, Image } from 'react-native';
import { styles } from "../styles/styles.js";
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../firebase';
import * as Linking from 'expo-linking';

export class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitedPartyId: ''
        }

        this.db = firebase.firestore();
        this.login = this.login.bind(this);
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
    }

    componentDidMount = async () => {
        try {
            const url = await Linking.getInitialURL();
            if (url) {
                this._handleUrl(url);
            }
            Linking.addEventListener('url', this._handleUrl);
        } catch (error) {
            console.error(error)
        }

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
                
                const loggedInUser = { name: userName, id: userID };
                if (this.state.invitedPartyId) {
                    this.autoJoinInvitedParty(this.state.invitedPartyId, loggedInUser);
                }
                this.props.navigation.navigate("Bottom Tabs", { loggedInUser });
            }
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleUrl);
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
            const loggedInUser = { name: userName, id};
            if (this.state.invitedPartyId) {
                this.autoJoinInvitedParty(this.state.invitedPartyId, loggedInUser);
            }
            this.props.navigation.navigate("Bottom Tabs", { loggedInUser });
        } catch (error) {
            console.log('Error login in to ', userName);
            Alert.alert(`Error login in to ${userName}`);
        }
    }

    signInWithGoogle = async () => {
        const IOS_CLIENT_ID = '22817374367-gqqgkjaur5fhjn8egj4d4liq83fhi8sa.apps.googleusercontent.com';
        const ANDROID_CLIENT_ID = '22817374367-blt4tbifsjft1f76mn0rehdnmu7lvsir.apps.googleusercontent.com';

        try {            
            const result = await Google.logInAsync({
                // behavior: 'web',
                androidClientId: ANDROID_CLIENT_ID,
                iosClientId: IOS_CLIENT_ID,
                scopes: ['profile', 'email'],
            });

            // console.log('on Google Signin, result', result);
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
                const loggedInUser = { name: userName, id: googleID }
                if (this.state.invitedPartyId) {
                    this.autoJoinInvitedParty(this.state.invitedPartyId, loggedInUser);
                }
                this.props.navigation.navigate("Bottom Tabs", { loggedInUser });
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

    _handleUrl = (url) => {
        const urlStr = (typeof(url) === 'object')? url.url : url;
        console.log('invited FULL URL: ', urlStr);
        const paramsArr = urlStr.split('=');
        if (paramsArr.length > 1) {
            const invitedPartyId = paramsArr[paramsArr.length - 1];
            console.log('invited PARTY_ID: ', invitedPartyId);
            this.setState({
                invitedPartyId: invitedPartyId
            });
        }
    };

    getPlaylistId = async (playlist) => {
        const playlistResponse = await playlist.get();
        return playlistResponse.id;
    }

    async autoJoinInvitedParty(invitedPartyId, loggedInUser) {
        const db = firebase.firestore();
        try {
            const response = await db.collection('party').where('joinId', '==', parseInt(invitedPartyId)).limit(1).get();
            const party = response.docs[0];
            const partyId = party.id
            const data = party.data();
            const { participants, playlist, name } = data;
            const playlistId = await this.getPlaylistId(playlist);
            // const userId = participants[participants.length - 1] + 1;
            participants.push(loggedInUser);
            Alert.alert(`Joining Party ${name}`);
            await db.collection('party').doc(partyId).update({ participants});
            
            this.props.navigation.navigate('Party View', {
                partyId: partyId,
                isHost: false,
                userId,
                playlist: playlistId,
                isInvited: true,
                participants,
                loggedInUser
            });
        }
        catch (e) {
            console.log('Error join existing party', e)
            Alert.alert(`Could not load party with Join Id ${invitedPartyId}`)
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