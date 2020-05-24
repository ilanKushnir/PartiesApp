import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../../styles/styles.js'
import SwipeableItem from 'react-native-swipeable-item'

export default class TrackItem extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            togglingMode: props.togglingMode || false,
            selected: false
        };
    }

    toggleItemSelection() {
        if (this.state.togglingMode) {
            this.setState(prevState => ({
                selected: !prevState.selected
            }));
        }
    }

    renderUnderlayLeft = ({ percentOpen }) => (
        <Animated.View
            style={[styles.row, styles.underlayLeft, { opacity: percentOpen }]} // Fade in on open
        >
            {/* <PlatformTouchable onPressOut={() => this.deleteItem(item.item)}>
            <Text style={styles.text}>{`[x]`}</Text>
          </PlatformTouchable> */}
        </Animated.View>
    );

    renderUnderlayRight = ({ percentOpen, close }) => (
        <Animated.View
        //   style={[
        //     styles.row,
        //     styles.underlayRight,
        //     {
        //       transform: [{ translateX: multiply(sub(1, percentOpen), -100) }] // Translate from left on open
        //     }
        //   ]}
        >
            <PlatformTouchable onPressOut={close}>
                <Text style={styles.text}>CLOSE</Text>
            </PlatformTouchable>
        </Animated.View>
    );

    renderOverlay = ({ openLeft, openRight, openDirection, close }) => {
        //const { text, backgroundColor, hasLeft, hasRight } = item.item;
        return (
            <View style={[styles.row, { backgroundColor }]}>
                <View style={[styles.flex, { alignItems: "flex-start" }]}>
                    {hasRight && (
                        <PlatformTouchable
                            onPressOut={!!openDirection ? close : () => openRight(1)}
                        >
                            <Text style={styles.text}>{`<`}</Text>
                        </PlatformTouchable>
                    )}
                </View>
                <PlatformTouchable style={styles.flex} onLongPress={item.drag}>
                    <Text style={styles.text}>{text}</Text>
                </PlatformTouchable>
                <View style={[styles.flex, { alignItems: "flex-end" }]}>
                    {hasLeft && (
                        <PlatformTouchable onPressOut={!!openDirection ? close : openLeft}>
                            <Text style={styles.text}>{`>`}</Text>
                        </PlatformTouchable>
                    )}
                </View>
            </View>
        );
    };

    render() {
        return (

            <SwipeableItem
                overSwipe={50}
                renderUnderlayLeft={this.renderUnderlayLeft}
                snapPointsLeft={item.hasLeft ? [100] : undefined}
                renderUnderlayRight={this.renderUnderlayRight}
                snapPointsRight={item.hasRight ? [100, width] : undefined}
                renderOverlay={this.renderOverlay}>
                onPress={() => {
                    this.props.onClickFunc(this.props.item)
                    this.toggleItemSelection()
                }}
                    onLongPress={this.props.onLongPress}>

                <View style={this.state.selected ? styles.trackItemSelected : styles.trackItem}>
                    <Image
                        style={{ width: 35, height: 35, marginRight: 10 }}
                        source={{ uri: this.props.imageSrc }}
                    />
                    <Text>
                        {this.props.title}
                    </Text>
                </View>
            </SwipeableItem >
        )
    }
}