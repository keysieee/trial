const bcrypt = require('bcrypt');
const con = require('../db/connection'); // Adjust path as needed for your db connection

// Signup controller
exports.signup = async (req, res) => {
    const { id_no, name, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await con.promise().query('INSERT INTO users (id_no, name, password) VALUES (?, ?, ?)', [id_no, name, hashedPassword]);
        res.redirect('/login');
    } catch (err) {
        console.error('Error in signup:', err);
        res.status(500).send('Server error');
    }
};

// Login controller
exports.login = async (req, res) => {
    const { id_no, password } = req.body;
    try {
        const [rows] = await con.promise().query('SELECT * FROM users WHERE id_no = ?', [id_no]);
        if (rows.length === 0) return res.status(400).send('User not found');
        
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send('Incorrect password');
        
        // Check role and redirect accordingly
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard'); // Adjust your admin dashboard route
        } else {
            res.redirect('/home'); // Regular user home page
        }
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).send('Server error');
    }
};

// Home controller
exports.home = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home.html')); // Adjust path as needed
};
