process.env.NODE_ENV = 'test';

const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

let server = require('../server.js');

let io = require('socket.io-client');
const PORT = process.env.PORT || 3000;
let socketUrl = 'http://localhost:'+PORT;

describe('test create TODO', () => {

    let todo1;
    let todo2;

    it('should user connect on socket', function (done) {
        socketUser = io(socketUrl, {
            transports: ['websocket']
        });

        expect(socketUser).to.not.be.undefined;
        expect(socketUser).to.not.be.null;

        socketUser.on('connect', () => {
            expect(socketUser.id).to.not.be.undefined;
            expect(socketUser.id).to.not.be.null;
            expect(socketUser.id).to.eql(socketUser.io.engine.id);

            setTimeout(() => {
                done();
            }, 250);
        });
    });

    it('should create a new TODO', function (done) {
        chai.request(server)
            .post('/api/v1/todo')
            .send({
                text: 'Launch a rocket!'
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todo).to.not.be.undefined;
                expect(res.body.todo.text).to.eql('Launch a rocket!');
                expect(res.body.todo.is_done).to.eql(false);
                expect(res.body.todo.created_at).to.not.be.undefined;
                expect(res.body.todo.updated_at).to.not.be.undefined;

                todo1 = res.body.todo;

                done();
            });
    });

    it('should test create TODO socket event', function(done) {
        socketUser.on('todo-events', (event) => {
            console.log("DATA =", event);

            expect(event.name).to.eql('create');
            expect(event.data._id).to.not.be.undefined;
            expect(event.data.text).to.eql('Launch a rocket again!');
            expect(event.data.is_done).to.eql(false);

            socketUser.off('todo-events');

            setTimeout(() => {
                done();
            }, 250);
        });

        chai.request(server)
            .post('/api/v1/todo')
            .send({
                text: 'Launch a rocket again!'
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todo).to.not.be.undefined;
                expect(res.body.todo.text).to.eql('Launch a rocket again!');
                expect(res.body.todo.is_done).to.eql(false);
                expect(res.body.todo.created_at).to.not.be.undefined;
                expect(res.body.todo.updated_at).to.not.be.undefined;

                todo2 = res.body.todo;
            });
    });

    it('should test update TODO socket event', function(done) {
        socketUser.on('todo-events', (event) => {
            console.log("DATA =", event);

            expect(event.name).to.eql('update');
            expect(event.data._id).to.not.be.undefined;
            expect(event.data.text).to.eql('Launch a rocket again!');
            expect(event.data.is_done).to.eql(true);

            socketUser.off('todo-events');

            setTimeout(() => {
                done();
            }, 250);
        });

        chai.request(server)
            .put('/api/v1/todo/'+todo2._id)
            .send({
                is_done: true
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todo).to.not.be.undefined;
                expect(res.body.todo.text).to.eql('Launch a rocket again!');
                expect(res.body.todo.is_done).to.eql(true);
                expect(res.body.todo.created_at).to.not.be.undefined;
                expect(res.body.todo.updated_at).to.not.be.undefined;
                expect(res.body.todo.updated_at).to.not.eql(todo2.updated_at);
            });
    });

    it('should fetch todos', function (done) {
        chai.request(server)
            .get('/api/v1/todo')
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todos).to.not.be.undefined;
                expect(res.body.todos.length).to.eql(2);
                expect(res.body.todos[0].text).to.eql('Launch a rocket!');
                expect(res.body.todos[1].text).to.eql('Launch a rocket again!');

                done();
            });
    });

    it('should test remove TODO socket event', function(done) {
        socketUser.on('todo-events', (event) => {
            console.log("DATA =", event);

            expect(event.name).to.eql('remove');
            expect(event.data._id).to.not.be.undefined;
            expect(event.data.text).to.eql('Launch a rocket!');
            expect(event.data.is_done).to.eql(false);

            socketUser.off('todo-events');

            setTimeout(() => {
                done();
            }, 250);
        });

        chai.request(server)
            .delete('/api/v1/todo/'+todo1._id)
            .send({
                is_done: true
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todo).to.be.undefined;
            });
    });

    it('should test remove TODO socket event', function(done) {
        socketUser.on('todo-events', (event) => {
            console.log("DATA =", event);

            expect(event.name).to.eql('remove');
            expect(event.data._id).to.not.be.undefined;
            expect(event.data.text).to.eql('Launch a rocket again!');
            expect(event.data.is_done).to.eql(true);

            socketUser.off('todo-events');

            setTimeout(() => {
                done();
            }, 250);
        });

        chai.request(server)
            .delete('/api/v1/todo/'+todo2._id)
            .send({
                is_done: true
            })
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todo).to.be.undefined;
            });
    });

    it('should fetch todos after remove', function (done) {
        chai.request(server)
            .get('/api/v1/todo')
            .end(function(err, res){
                console.log(err, res.body);

                expect(res.status).to.eql(200);
                expect(res.body.success).to.eql(true);
                expect(res.body.todos).to.not.be.undefined;
                expect(res.body.todos.length).to.eql(0);

                done();
            });
    });

    it('disconnect user from socket', function(done) {
        socketUser.disconnect();

        setTimeout(() => {
            done();
        }, 250);
    });
});
