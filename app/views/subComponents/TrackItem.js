import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TrackItem = props => {
    return (
        <TouchableOpacity onPress={() => {
            props.loadVideoFunc(props.id)
        }}>
            <View style={styles.trackItem}>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: props.imageSrc }}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    trackItem: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'grey',
        borderColor: 'black',
        borderWidth: 1
    }
});

export default TrackItem;