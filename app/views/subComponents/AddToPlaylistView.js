import React from 'react'
import { View, Button, Text, TouchableOpacity } from 'react-native'
import { styles } from '../../styles/styles.js'
import { StackActions } from '@react-navigation/native'

export default class AddToPlaylistView extends React.Component {
    render() {
        return (
            <View style={styles.center, styles.row}>
                <Text>add to playlist</Text>
                <Button
                    onPress={() => this.props.navigation.dispatch(StackActions.pop())}
                    title="Cancel"
                    color="#d2691e"
                />

                {/* {this.state.listLoaded && (
                    <FlatList
                        data={this.state.tracks}
                        renderItem={({ item }) =>
                            <TrackItem
                                key={item.id}
                                id={item.videoId}
                                title={item.title}
                                imageSrc={item.image}
                                loadVideoFunc={this.props.loadVideoToPlayer}
                            />
                        }
                        keyExtractor={item => item.id}
                    />
                )}

                {!this.state.listLoaded && (
                    <Text> LOADING... </Text>
                )} */}
            </View>

        )
    }
}