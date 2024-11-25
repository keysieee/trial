const db = require('../config/db'); // MySQL connection using promises

// Get inventory items filtered by category
exports.getInventory = async (req, res) => {
    const category = req.params.category || null;

    try {
        let query = 'SELECT * FROM inventory';
        let params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const [rows] = await db.query(query, params);
        res.render('admin/inventory', { inventory: rows, currentCategory: category });
    } catch (err) {
        console.error('Error retrieving inventory:', err);
        res.status(500).send('Error retrieving inventory');
    }
};

// Add a new inventory item
exports.addInventoryItem = async (req, res) => {
    const { category, product_name, price, stocks } = req.body;

    try {
        await db.query(
            'INSERT INTO inventory (category, product_name, price, stocks) VALUES (?, ?, ?, ?)',
            [category, product_name, price, stocks]
        );
        res.redirect(`/inventory/${category}`);
    } catch (err) {
        console.error('Error adding inventory item:', err);
        res.status(500).send('Error adding inventory item');
    }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
    const { id } = req.params;
    const { product_name, price, stocks } = req.body;

    try {
        await db.query(
            'UPDATE inventory SET product_name = ?, price = ?, stocks = ? WHERE id = ?',
            [product_name, price, stocks, id]
        );
        res.redirect('/inventory');
    } catch (err) {
        console.error('Error updating inventory item:', err);
        res.status(500).send('Error updating inventory item');
    }
};


// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM inventory WHERE id = ?', [id]);
        res.redirect('/inventory');
    } catch (err) {
        console.error('Error deleting inventory item:', err);
        res.status(500).send('Error deleting inventory item');
    }
};
