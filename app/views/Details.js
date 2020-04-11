import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export class Details extends React.Component {

    render() {
    return(
        <View style= {styles.container}>
        <Text>Detailsss!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container:
    {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
    }
})