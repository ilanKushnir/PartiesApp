import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../../styles/styles.js'


const TrackItem = props => {
    return (
        <TouchableOpacity onPress={() => {
            props.loadVideoFunc(props.id)
        }}>
            <View style={styles.trackItem}>
                <Image
                    style={{ width: 35, height: 35, marginRight: 10 }}
                    source={{ uri: props.imageSrc }}
                />
                <Text>
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default TrackItem;