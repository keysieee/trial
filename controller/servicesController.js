const db = require('../config/db');

// Get all returns
exports.getReturns = async () => {
    const [results] = await db.query('SELECT * FROM return_refunds');
    return results;
};

// Get all discounts
exports.getDiscounts = async () => {
    const [results] = await db.query('SELECT * FROM discount_promotions');
    return results;
};

// Update a return
exports.updateReturn = async (id, data) => {
    const { customer_name, item, quantity, reason, price } = data;
    await db.query(
        'UPDATE return_refunds SET customer_name = ?, item = ?, quantity = ?, reason = ?, price = ? WHERE id = ?',
        [customer_name, item, quantity, reason, price, id]
    );
};

// Update a discount
exports.updateDiscount = async (id, data) => {
    const { customer_name, item, discount, price_after_discount } = data;
    await db.query(
        'UPDATE discount_promotions SET customer_name = ?, item = ?, discount = ?, price_after_discount = ? WHERE id = ?',
        [customer_name, item, discount, price_after_discount, id]
    );
};

// Delete a return
exports.deleteReturn = async (id) => {
    await db.query('DELETE FROM return_refunds WHERE id = ?', [id]);
};

// Delete a discount
exports.deleteDiscount = async (id) => {
    await db.query('DELETE FROM discount_promotions WHERE id = ?', [id]);
};
