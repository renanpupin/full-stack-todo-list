const express = require('express');
const router = express.Router();

const { asyncMiddleware } = require("../middlewares/async.js");


const todoController = require("../controllers/todo");

/**
 * @api {post} /v1/todo 1. Create todo
 * @apiVersion 1.0.0
 * @apiGroup Todo
 * @apiSampleRequest https://api-url.com/v1/todo
 * @apiDescription Create todo
 *
 * @apiParam (Body Params) {String} text Todo text content.
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Some success message"
 *      "todo": {...}    //todo object
 *    }
 *
 * @apiErrorExample {json} Error
 *    HTTP/1.1 200 OK
 *    {
 *      "success": false,
 *      "message": "Some error message."
 *    }
 */
router.post("/todo", asyncMiddleware(async (req, res) => {
    let text = req.body.text;

    let todo = await todoController.createTodo(text);

    res.json({
        success: true,
        message: 'Todo created with success.',
        todo
    });
}));

/**
 * @api {put} /v1/todo/:id 2. Update todo
 * @apiVersion 1.0.0
 * @apiGroup Todo
 * @apiSampleRequest https://api-url.com/v1/todo/:id
 * @apiDescription Update todo
 *
 * @apiParam (Url Params) {String} id Todo _id.
 *
 * @apiParam (Body Params) {String} [text] Todo text content.
 * @apiParam (Body Params) {String} [is_done] Todo done flag.
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Some success message"
 *      "todo": {...}    //todo object
 *    }
 *
 * @apiErrorExample {json} Error
 *    HTTP/1.1 200 OK
 *    {
 *      "success": false,
 *      "message": "Some error message."
 *    }
 */
router.put("/todo/:id", asyncMiddleware(async (req, res) => {
    let todo = await todoController.updateTodo(req.params.id, req.body);

    res.json({
        success: true,
        message: 'Todo updated with success.',
        todo
    });
}));

/**
 * @api {delete} /v1/todo/:id 3. Remove todo
 * @apiVersion 1.0.0
 * @apiGroup Todo
 * @apiSampleRequest https://api-url.com/v1/todo/:id
 * @apiDescription Remove todo
 *
 * @apiParam (Url Params) {String} id Todo _id.
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Some success message"
 *    }
 *
 * @apiErrorExample {json} Error
 *    HTTP/1.1 200 OK
 *    {
 *      "success": false,
 *      "message": "Some error message."
 *    }
 */
router.delete("/todo/:id", asyncMiddleware(async (req, res) => {
    await todoController.removeTodo(req.params.id);

    res.json({
        success: true,
        message: 'Todo removed with success.'
    });
}));

/**
 * @api {get} /v1/todo 4. Get todos
 * @apiVersion 1.0.0
 * @apiGroup Todo
 * @apiSampleRequest https://api-url.com/v1/todo
 * @apiDescription Get todos
 *
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Some success message",
 *      "todos": [{}]   //array of TODOs object
 *    }
 *
 * @apiErrorExample {json} Error
 *    HTTP/1.1 200 OK
 *    {
 *      "success": false,
 *      "message": "Some error message."
 *    }
 */
router.get("/todo", asyncMiddleware(async (req, res) => {
    let todos = await todoController.getTodos();

    res.json({
        success: true,
        message: 'Todos fetched with success.',
        todos
    });
}));

module.exports = router;
