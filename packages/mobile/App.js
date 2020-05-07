import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';

import commonConfig from './src/utils/config';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            creating: false,
            updating: false,
            removing: false,
            text: '',
            todos: []
        }
    }

    componentDidMount() {
        this.fetchTodos();
    }

    fetchTodos = async () => {
        try {
            this.setState({
                loading: true
            });

            const response = await axios({
                url: `${commonConfig.getApiUrl()}/api/v1/todo`,
                method: 'GET',
                // data: {},
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            });
            console.log("fetchTodos response", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            this.setState({
                loading: false,
                todos: response.data.todos
            });

        } catch (err) {
            console.log(err);

            this.setState({
                loading: false
            });

            alert(err.message);
        }
    }

    createTodo = async () => {
        try {
            if(this.state.creating){
                return;
            }

            this.setState({
                creating: true
            });

            const response = await axios({
                url: `${commonConfig.getApiUrl()}/api/v1/todo`,
                method: 'POST',
                data: {
                    text: this.state.text
                },
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            });
            console.log("createTodo response", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            this.setState({
                creating: false,
                text: '',
                todos: [
                    ...this.state.todos,
                    response.data.todo
                ]
            });

        } catch (err) {
            console.log(err);

            this.setState({
                creating: false
            });

            alert(err.message);
        }
    }

    updateTodo = async (id, body) => {
        try {
            this.setState({
                updating: true
            });

            const response = await axios({
                url: `${commonConfig.getApiUrl()}/api/v1/todo/${id}`,
                method: 'PUT',
                data: body,
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            });
            console.log("updateTodo response", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            this.setState({
                updating: false,
                todos: this.state.todos.filter(item => {
                    if (item._id === id) {
                        return response.data.todo;
                    } else {
                        return item;
                    }
                })
            });

        } catch (err) {
            console.log(err);

            this.setState({
                updating: false
            });

            alert(err.message);
        }
    }

    removeTodo = async (id) => {
        try {
            this.setState({
                removing: true
            });

            const response = await axios({
                url: `${commonConfig.getApiUrl()}/api/v1/todo/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=utf-8'
                }
            });
            console.log("removeTodo response", response.data);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            this.setState({
                removing: false,
                todos: this.state.todos.filter(item => item._id !== id)
            });

        } catch (err) {
            console.log(err);

            this.setState({
                removing: false
            });

            alert(err.message);
        }
    }

    render() {
        const rows = this.state.todos.map((item, index) => {
            return (
                <View
                    key={index}
                    style={{
                        dispaly: 'flex',
                        flexDirection: 'row',
                        borderColor: "#e1e1e1",
                        // borderWidth: 1,
                        borderBottomWidth: index === this.state.todos.length-1 ? 0 : 1,
                        padding: 10,
                        borderRadius: 3
                    }}
                >
                    <View
                        style={{flex: 1, marginRight: 10}}
                        onBlur={(event) => {
                            this.updateTodo(item._id, {text: event.currentTarget.textContent})
                        }}
                    >
                        <Text>{item.text}</Text>
                    </View>
                    <View
                        style={{flex: 0, alignItems: 'flex-end', justifyContent: 'center'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.removeTodo(item._id)}
                            style={{marginLeft: 10, fontSize: 12}}
                        >
                            <Text style={{color: 'blue'}}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        });

        return (
            <View style={styles.container}>
                <View style={{flex: 0, marginBottom: 20}}>
                    <Text style={{fontWeight: "bold"}}>TODOs</Text>
                </View>

                <View style={{flex: 1}}>
                    {this.state.loading && <Text>Loading...</Text>}

                    <View
                        testID="list-todos"
                        style={{
                            borderColor: "#e1e1e1",
                            borderWidth: 1,
                            borderRadius: 6,
                        }}
                    >
                        {rows}
                    </View>

                    {!this.state.loading && rows.length === 0 && <Text>No TODOs found.</Text>}

                    <View style={{flex: 1, marginTop: 20}}>
                        <TextInput
                            type={"text"}
                            placeholder={"Write your new TODO"}
                            value={this.state.text}
                            style={{
                                minWidth: 200,
                                borderWidth: 1,
                                borderColor: '#e1e1e1',
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                borderRadius: 20
                            }}
                            disabled={this.state.creating}
                            onChangeText={(text) => {
                                this.setState({
                                    text
                                });
                            }}
                        />

                        <TouchableOpacity
                            onPress={this.createTodo}
                            style={{marginTop: 10, fontSize: 12, alignItems: 'center'}}
                        >
                            <Text style={{color: 'blue'}}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40
    },
});

export default App;
