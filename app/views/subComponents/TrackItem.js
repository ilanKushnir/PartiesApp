import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TrackItem = props => {
    return(
        <TouchableOpacity onPress={props.onTrackSelect}>
            <View style={styles.trackItem}>
                <Text>{props.trackName}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    trackItem: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'black',
        borderColoe: 'black',
        borderWidth: 1
    }
});

export default TrackItem;