const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

router.get('/', taskController.getTasks);
router.post('/add', taskController.addTask);
router.post('/toggle/:id', taskController.toggleTask);
router.post('/delete/:id', taskController.deleteTask);

module.exports = router;
