const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');

// Define your routes here
router.get('/', (req, res) => {
    // Get inventory items and render the inventory page
});

router.post('/add', (req, res) => {
    // Add item to inventory
});

router.post('/update/:id', (req, res) => {
    // Update item in inventory
});

router.post('/delete/:id', (req, res) => {
    // Delete item from inventory
});

module.exports = router;
