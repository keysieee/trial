const express = require('express');
const router = express.Router();
const servicesController = require('../controller/servicesController');

// Get all returns and discounts
router.get('/', async (req, res) => {
    try {
        const returns = await servicesController.getReturns();
        const discounts = await servicesController.getDiscounts();
        res.render('services', { returns, discounts });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Update Return
router.put('/update/return/:id', async (req, res) => {
    try {
        await servicesController.updateReturn(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Error updating return');
    }
});

// Update Discount
router.put('/update/discount/:id', async (req, res) => {
    try {
        await servicesController.updateDiscount(req.params.id, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Error updating discount');
    }
});

// Delete Return
router.post('/delete/return/:id', async (req, res) => {
    try {
        await servicesController.deleteReturn(req.params.id);
        res.redirect('/services');
    } catch (error) {
        res.status(500).send('Error deleting return');
    }
});

// Delete Discount
router.post('/delete/discount/:id', async (req, res) => {
    try {
        await servicesController.deleteDiscount(req.params.id);
        res.redirect('/services');
    } catch (error) {
        res.status(500).send('Error deleting discount');
    }
});

module.exports = router;
