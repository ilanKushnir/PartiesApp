import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { styles } from '../styles/styles.js'
import { StackActions } from '@react-navigation/native';
import firebase from '../../firebase.js';
import PublicPartyItem from '../views/subComponents/PublicPartyItem';

export class PublicPartiesTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listLoaded: false,
      publicParties: []
    }
    this.db = firebase.firestore();
  }

  async componentDidMount() {
    try {
        await this.getPartiesArray();
        this.setState({ 
          listLoaded: true
        })
    } catch (error) {
        console.log(error);
    }
  }
  
  getPartiesArray = async() => {
    // const partiesFromDB = await this.db.collection('party').orderBy("creationTime", "desc").where("partyMode", "==", "public").limit(100).get();
    const partiesFromDB = await this.db.collection('party').orderBy("creationTime", "desc").limit(100).get();
    const partiesData = partiesFromDB.docs;
    partiesData.forEach(party => {
      const { name, condition } = party.data();
      const joinId = party.data().joinId.toString();
      const joinedArr = this.state.publicParties.concat({ joinId, name, condition });
      this.setState({ 
        publicParties: joinedArr
      })
      
    });
  } 

  render() {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Public Parties</Text>
        <Text>top playlists table</Text>
        <Text>--- tap ---></Text>
        <Text>playlist preview</Text>
        <Text>+load to party option</Text>

        <View style={{ flex: 3, paddingTop: 0 }}>
          {this.state.listLoaded && (
                <FlatList
                    data={this.state.publicParties}
                    renderItem={({ item }) =>
                    <PublicPartyItem
                          key={item.joinId}
                          joinId={item.joinId}
                          name={item.name}
                          condition={item.condition}
                          // onClickFunc={() => this.loadVideoToPlayer(index)}
                      />
                    }
                    keyExtractor={item => item.joinId}
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






