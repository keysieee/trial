const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const servicesRoutes = require('./routes/services');
const tasksRoutes = require('./routes/tasks');
const inoutRoutes = require('./routes/inout');
const inventoryRoutes = require('./routes/inventory');

const app = express();

// Middleware for session
app.use(session({
    secret: 'sajdsajdasdasdjjkgfggasd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/inout', inoutRoutes);

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Route for updating
app.put('/inout/update/:id', (req, res) => {
    const id = req.params.id;
    // Example logic to handle the update
    // You might want to interact with a database here
    console.log(`Updating In/Out status for ID: ${id}`);
    res.send(`Updated In/Out status for ID: ${id}`);
});

// Middleware for static files and form data parsing
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Routes for /tasks
app.use('/tasks', tasksRoutes);

// Routes for /inventory
app.use('/inventory', inventoryRoutes);

// Use the services routes (this will catch all /services* routes)
app.use('/services', servicesRoutes);

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Home route with login check
app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home');
});

//nadagdag
app.get('/inout', (req, res) => {
    const employee_id = req.session.employee_id || null; // Assuming employee_id is stored in the session
    const records = []; // Fetch records from your database
    
    res.render('inout', {
        employee_id,
        records,
    });
});

// Route to handle adding attendance records
app.post('/inout/add', async (req, res) => {
    const { employee_id, branch, location, time_in, time_out, date } = req.body;

    try {
        await db.query(
            'INSERT INTO attendance (employee_id, branch, location, time_in, time_out, date) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, branch, location, time_in, time_out, date]
        );
        res.redirect('/inout'); // Redirect to the inout page after adding
    } catch (err) {
        console.error("Error adding attendance record:", err);
        res.status(500).send("Server error");
    }
});

// Admin inventory page route with login and admin check
app.get('/admin/inventory', isAdmin, (req, res) => {
    res.render('admin/inventory'); // Render inventory page for admins
});

// EmpShop route with login check
app.get('/empshop', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('empshop');
});

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
    if (req.session.loggedin && req.session.role === 'admin') {
        return next();
    }
    res.redirect('/login');
}

// Admin route with admin check
app.get('/admin', isAdmin, (req, res) => {
    res.render('admin');
});

// Login page route
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { id_no, password } = req.body;

    try {
        // Fetch user by ID
        const [rows] = await db.query('SELECT * FROM users WHERE id_no = ?', [id_no]);

        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.loggedin = true;
                req.session.user = user;
                req.session.role = user.role; // Set the role from the database

                // Redirect based on role
                if (user.role === 'admin') {
                    return res.redirect('/admin'); // Redirect to admin dashboard
                } else if (user.role === 'employee') {
                    return res.redirect('/home'); // Redirect to employee home page
                }
            } else {
                return res.status(400).send('Incorrect password!');
            }
        } else {
            return res.status(404).send('User not found!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred. Please try again.');
    }
});

// Signup page route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Signup form submission handling
app.post('/signup', async (req, res) => {
    const { id_no, name, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.redirect('/signup');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (id_no, name, password) VALUES (?, ?, ?)', [id_no, name, hashedPassword]);

    res.redirect('/login');
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/login');
    });
});

// Services route with login check and data retrieval
app.get('/services', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Retrieve return_refunds data
        const [returns] = await db.query('SELECT * FROM return_refunds');
        // Retrieve discount promotions data
        const [discounts] = await db.query('SELECT * FROM discount_promotions');

        // Render services view with return_refunds and discount data
        res.render('services', { returns, discounts });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server error");
    }
});

// Add a return
app.post('/services/add/return', async (req, res) => {
    const { customer_name, item, quantity, reason, price } = req.body;

    try {
        await db.query('INSERT INTO return_refunds (customer_name, item, quantity, reason, price) VALUES (?, ?, ?, ?, ?)', 
            [customer_name, item, quantity, reason, price]);
        res.redirect('/services'); // After insertion, redirect back to /services
    } catch (err) {
        console.error("Error adding return:", err);
        res.status(500).send("Server error");
    }
});

// Add a discount (calculate price after discount)
app.post('/services/add/discount', async (req, res) => {
    const { customer_name, item, discount, price } = req.body;

    // Validate the inputs to ensure they are correct and numbers
    if (isNaN(discount) || isNaN(price) || discount < 0 || discount > 100 || price < 0) {
        return res.status(400).send("Invalid input data");
    }

    // Calculate price after discount
    const price_after_discount = price - (price * (discount / 100));

    try {
        await db.query('INSERT INTO discount_promotions (customer_name, item, discount, price_after_discount) VALUES (?, ?, ?, ?)', 
            [customer_name, item, discount, price_after_discount]);
        res.redirect('/services'); // After insertion, redirect back to /services
    } catch (err) {
        console.error("Error adding discount:", err);
        res.status(500).send("Server error");
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
