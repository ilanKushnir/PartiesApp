import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Keyboard, Alert, Image } from 'react-native';
import { styles } from "../styles/styles.js";
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../firebase';
import * as Linking from 'expo-linking';
import { DB_TABLES,PARTY_MODES,USER_PERMISSION } from '../../assets/utils'; 
import { CommonActions } from '@react-navigation/native';

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
        if(userID !== 'NO_USER_ID') {
            console.log('Trying login to last user from device storage');
            
            const user = await this.db.collection(DB_TABLES.USER).doc(userID).get();
            if(user.exists) {

                this.setState({remmemberLogin: true})
                const data = user.data();
                const { userName } = data;
                console.log('succeded login to ', userName);
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

    handleLogout = async () => {
        await this.saveLoginToDevice('NO_USER_ID');
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
            console.log(error); 
        }
      }

    login = async () => {
        Keyboard.dismiss();
        const { userName, password } = this.state;
        console.log('on login', userName);

        try {
            const response = await this.db.collection(DB_TABLES.USER).where('userName', '==', userName).limit(1).get();
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
                const userResponse = await this.db.collection(DB_TABLES.USER).add({
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

            if (result.type === 'success') {
                const { id, name: userName, email, photoUrl } = result.user;
                const googleID = `GOOGLE:${id}`;

                const user = await this.db.collection(DB_TABLES.USER).doc(googleID).get();
                if(!user.exists) {
                    console.log('Creating new user on firestore:', userName, googleID);
                    await this.db.collection(DB_TABLES.USER).doc(googleID).set({
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
            const response = await db.collection(DB_TABLES.PARTY).where('joinId', '==', parseInt(invitedPartyId)).limit(1).get();
            const party = response.docs[0];
            const partyId = party.id
            const data = party.data();
            const { participants, playlist, name, partyMode } = data;
            const playlistId = await this.getPlaylistId(playlist);
            
            const myUserInParticipants = participants.find(user => user.id === loggedInUser.id);
            if(myUserInParticipants) {
                loggedInUser = myUserInParticipants;
            } else {    //  User is new to this party
                loggedInUser.permission = partyMode === PARTY_MODES.FRIENDLY ? USER_PERMISSION.DJ : USER_PERMISSION.GUEST;
                participants.push(loggedInUser);
                await db.collection(DB_TABLES.PARTY).doc(partyId).update({ participants});
            }

            const navigateAction = CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Party Time Tab',
                        params: {
                            partyId: partyId,
                            playlist: playlistId,
                            isInvited: true,
                            participants,
                            loggedInUser
                        },
                    }
                    ],
            });
            this.props.navigation.dispatch(navigateAction);
        }
        catch (e) {
            console.log('Error join existing party', e)
            Alert.alert(`Could not load party with Join Id ${invitedPartyId}`)
        }
    }

    render() {
        const logout = this.props.route?.params?.logout || false;
        if(logout) this.handleLogout();

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