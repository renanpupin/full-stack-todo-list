import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

import commonConfig from '../../common/utils/config';

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
        try{
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

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            this.setState({
                loading: false,
                todos: response.data.todos
            });

        }catch (err) {
            console.log(err);

            this.setState({
                loading: false
            });

            alert(err.message);
        }
    }

    createTodo = async () => {
        try{
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

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            this.setState({
                creating: false,
                todos: [
                    ...this.state.todos,
                    response.data.todo
                ]
            });

        }catch (err) {
            console.log(err);

            this.setState({
                creating: false
            });

            alert(err.message);
        }
    }

    updateTodo = async (id, body) => {
        try{
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

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            this.setState({
                updating: false,
                todos: this.state.todos.filter(item => {
                    if(item._id === id){
                        return response.data.todo;
                    }else{
                        return item;
                    }
                })
            });

        }catch (err) {
            console.log(err);

            this.setState({
                updating: false
            });

            alert(err.message);
        }
    }

    removeTodo = async (id) => {
        try{
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

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            this.setState({
                removing: false,
                todos: this.state.todos.filter(item => item._id !== id)
            });

        }catch (err) {
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
                <li
                    key={index}
                    style={{
                        dispaly: 'flex',
                        flexDirection: 'row',
                        borderWidth: index === this.state.todos.length-1 ? 0 : 1
                    }}
                >
                    <span
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={(event) => {
                            this.updateTodo(item._id, {text: event.currentTarget.textContent})
                        }}
                    >{item.text}</span>
                    <button
                        onClick={() => this.removeTodo(item._id)}
                        style={{marginLeft: 10}}
                    >
                        Remove
                    </button>
                </li>
            )
        })

        return (
            <div className="App">
                <h1>TODOs</h1>

                {this.state.loading && <p>Loading...</p>}

                <ul data-testid="list-todos">
                    {rows}
                </ul>

                {!this.state.loading && rows.length === 0 && <p>No TODOs found.</p>}

                <form onSubmit={this.createTodo}>
                    <input data-testid="input-todo" type={"text"} placeholder={"Write your new TODO"} value={this.state.text} onChange={(event) => {this.setState({text: event.target.value})}}/>

                    <button data-testid="submit-todo" type={"submit"} className={"add-button"}>Add</button>
                </form>
            </div>
        );
    }
}

export default App;
