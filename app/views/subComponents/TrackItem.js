import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../../styles/styles.js'

export default class TrackItem extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: false
        };
    }

    toggleItemSelection() {
        this.setState(prevState => ({
            selected: !prevState.selected
        }));
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onClickFunc(this.props.item)
                this.toggleItemSelection()
            }}>

                <View style={this.state.selected ? styles.trackItemSelected : styles.trackItem}>
                    <Image
                        style={{ width: 35, height: 35, marginRight: 10 }}
                        source={{ uri: this.props.imageSrc }}
                    />
                    <Text>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}