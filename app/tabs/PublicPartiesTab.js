import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';
import firebase from '../../firebase.js';
import PublicPartyItem from '../views/PublicPartyItem';
import { DB_TABLES } from '../../assets/utils';

export class PublicPartiesTab extends React.Component {
  constructor(props) {
    super(props);
    this.db = firebase.firestore();
    this.bindPartiesChangesFromDB = this.bindPartiesChangesFromDB.bind(this);
    this.state = {
      listLoaded: false,
      publicParties: []
    }
  }

  async componentDidMount() {
    this._isMounted = true;

    try {
      await this.bindPartiesChangesFromDB();
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  bindPartiesChangesFromDB = async () => {
    let updatePartiesArr = this.state.publicParties;
    try {
      const observer = await this.db.collection(DB_TABLES.PARTY).orderBy("creationTime", "desc").where("isPublic", "==", true).limit(100)
        .onSnapshot(querySnapshot => {

          querySnapshot.docChanges().forEach(change => {
            const { name, condition, joinId } = change.doc.data();
            const id = change.doc.id;

            if (change.type === 'added') {
              updatePartiesArr.push({ id, joinId, name, condition });
            }
            if (change.type === 'modified') {
              updatePartiesArr.map((party) => {
                if (party.joinId === joinId) {
                  party.condition = condition;
                }
                return party;
              });
            }
            
            updatePartiesArr = updatePartiesArr.sort((a,b) => b.joinId - a.joinId);
            
            this.setState({
              PublicParties: updatePartiesArr,  
              listLoaded: true
            })
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{justifyContent: "center",alignItems: "center",flex:1,...styles.appBackgroundColor}}>
        <Text style={{ ...styles.title, position: 'absolute', top: 17 }}>Public Parties</Text>
        <View style={{
          flex: 1, paddingTop: 65,
          alignSelf: 'stretch',
          textAlign: 'center',
          height:200
        }}>
          <View style={{ flexDirection: "row", justifyContent: 'space-evenly'}}>
            <Text style={{
              flex: 6, fontWeight: 'bold', position: 'relative', left: 9,marginBottom:15
            }}>
              Name
                    </Text>
            <Text style={{ flex: 6, fontWeight: 'bold' }}>
              Status
                    </Text>
            <Text style={{ flex: 2, fontWeight: 'bold' }}>
              ID
             </Text>
          </View>
          {this.state.listLoaded && (
            <FlatList
            style={{ alignSelf: 'stretch'
          }}
              data={this.state.publicParties}
              renderItem={({ item }) =>
                <PublicPartyItem
                  key={item.id}
                  joinId={item.joinId}
                  name={item.name}
                  condition={item.condition}
                  navigation={navigation}
                  loggedInUser={this.props.route.params.loggedInUser}
              />
              }
              keyExtractor={item => item.id}
            />
          )}
          {!this.state.listLoaded && (
            <Text> LOADING... </Text>
          )}
        </View>
        {/* <View style={{height:50}}></View> */}
      </View>
    )
  }
}






