// models/user.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static createUser(id_no, name, password) {
        return new Promise((resolve, reject) => {
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.query('INSERT INTO users (id_no, name, password) VALUES (?, ?, ?)', [id_no, name, hashedPassword], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static findUserById(id_no) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id_no = ?', [id_no], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = User;
