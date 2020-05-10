import React, {PureComponent} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Modal,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
    Text
} from 'react-native';

// import CloseButton from '../closeButton';

class NewTodoModal extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={this.props.onClose}
                onBackdropPress={this.props.onClose}
                style={{
                    // backgroundColor: 'black',
                }}
            >
                <View style={{flex: 1, justifyContent: 'flex-end',}}>
                    <View style={{flex: 1, maxHeight: this.props.maxHeight || '100%'}}>
                        <SafeAreaView style={{ flex: 0, backgroundColor: 'transparent' }} />
                        <SafeAreaView style={{ flex: 1, backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : (this.props.negative ? '#373737' : '#fff'), marginTop: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24}}>
                            <View style={[{padding: 20}, this.props.styleHeader]}>
                                <View style={{flexDirection: 'row'}}>
                                    {/*<CloseButton*/}
                                    {/*    onPress={this.props.onClose}*/}
                                    {/*    negative={this.props.negative || false}*/}
                                    {/*    showText={true}*/}
                                    {/*    style={{*/}
                                    {/*        flex: 1,*/}
                                    {/*        paddingTop: 0,*/}
                                    {/*        marginRight: 12*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    {this.props.headerComponent}
                                </View>
                            </View>
                            <View style={{flex: 1, padding: 0}}>
                                {this.props.children}
                            </View>
                        </SafeAreaView>
                        <SafeAreaView style={{ flex: 0, backgroundColor: this.props.backgroundColor }} />
                    </View>
                </View>
            </Modal>
        );
    }
}

export default NewTodoModal;
