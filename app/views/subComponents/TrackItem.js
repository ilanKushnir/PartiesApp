import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TrackItem = props => {
    return(
        <TouchableOpacity>
            <View style={styles.trackItem}>
                <Image
                    style={{ width: '100%', height: 200}}
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
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 1
    }
});

export default TrackItem;