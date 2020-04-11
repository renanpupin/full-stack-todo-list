import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
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
                        borderWidth: index === this.state.todos.length - 1 ? 0 : 1
                    }}
                >
                    <View
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(event) => {
                            this.updateTodo(item._id, {text: event.currentTarget.textContent})
                        }}
                    >
                        <Text>{item.text}</Text>
                    </View>
                    <Button
                        onPress={() => this.removeTodo(item._id)}
                        style={{marginLeft: 10}}
                        title={"Remove"}
                    />
                </View>
            )
        });

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text style={{fontWeight: "bold"}}>TODOs</Text>
                </View>

                <View style={{flex: 1}}>
                    {this.state.loading && <Text>Loading...</Text>}

                    <View testID="list-todos">
                        {rows}
                    </View>

                    {!this.state.loading && rows.length === 0 && <Text>No TODOs found.</Text>}

                    <View style={{flex: 1}}>
                        <TextInput
                            type={"text"}
                            placeholder={"Write your new TODO"}
                            value={this.state.text}
                            onChange={(text) => {
                                this.setState({text: text})
                            }}
                        />

                        <Button type={"submit"} className={"add-button"} title={"Add"} onPress={this.createTodo}/>
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
