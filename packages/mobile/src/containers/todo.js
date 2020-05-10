import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Platform} from 'react-native';

import TodoScreen from '../screens/todo'

class TodoContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        //
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TodoScreen/>
            </View>
        );
    }
}

export default TodoContainer;
