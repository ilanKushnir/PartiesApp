import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';
import firebase from '../../firebase.js';
import PublicPartyItem from '../views/subComponents/PublicPartyItem';
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
    try {
      await this.bindPartiesChangesFromDB();
    } catch (error) {
      console.log(error);
    }
  }
  
  bindPartiesChangesFromDB = async() => {
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
              if(party.joinId === joinId){
                party.condition = condition;
              }
              return party;
            });
          }

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
      <View style={styles.center}>
        <Text style={styles.title}>Public Parties</Text>
        <View style={{ flex: 1, paddingTop: 100 }}>
          {this.state.listLoaded && (
                <FlatList
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
      </View>
    )
  }
}






