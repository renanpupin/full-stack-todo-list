const Todo = require('../models/todo');
// const ioEmitterService = require('../services/socketEmitter');
const socketService = require('../services/socket');

exports.createTodo = async (text) => {
    console.log("createTodo", text);

    if(!text){
        throw new Error("Please fill TODO text.")
    }

    let todo = await new Todo({
        text
    }).save();

    socketService.send('todo-events', {
        name: 'create',
        data: todo.toObject()
    });

    return todo;
};

exports.updateTodo = async (id, body) => {
    console.log("updateTodo", id, body);

    if(!id){
        throw new Error("TODO id not found.")
    }

    let text = body.text;
    let isDone = body.is_done;

    let todo = await Todo.findOne({_id: id});
    if(!todo){
        throw new Error("TODO not found.")
    }

    if(text){
        todo.text = text;
    }

    if(isDone !== null && isDone !== undefined){
        todo.is_done = isDone;
    }

    todo = await todo.save();

    socketService.send('todo-events', {
        name: 'update',
        data: todo.toObject()
    });

    return todo;
};

exports.removeTodo = async (id) => {
    console.log("removeTodo", id);

    if(!id){
        throw new Error("TODO id not found.")
    }

    let todo = await Todo.findOne({_id: id});
    if(!todo){
        throw new Error("TODO not found.")
    }

    await todo.remove();

    socketService.send('todo-events', {
        name: 'remove',
        data: todo.toObject()
    });

    return todo;
};

exports.getTodos = async () => {
    console.log("getTodos");

    let todos = await Todo.find();

    return todos;
};
