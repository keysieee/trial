const db = require('../config/db');

// Get attendance records for logged-in employee
const getEmployeeAttendance = async (req, res) => {
    try {
        const employeeId = req.session.employee_id;
        if (!employeeId) return res.redirect('/login');

        const [attendanceRecords] = await db.query(
            'SELECT * FROM attendance WHERE employee_id = ?',
            [employeeId]
        );

        res.render('inout', { records: attendanceRecords });
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        res.status(500).send('Server error');
    }
};

// Add attendance record (Time-In)
const addAttendanceRecord = async (req, res) => {
    try {
        const employeeId = req.session.employee_id;
        if (!employeeId) return res.redirect('/login');

        const { branch, location } = req.body;
        const time_in = new Date().toISOString().slice(11, 19); // Auto-generate time_in
        const date = new Date().toISOString().slice(0, 10); // Auto-generate today's date

        const sql =
            'INSERT INTO attendance (employee_id, branch, location, time_in, date) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [employeeId, branch, location, time_in, date]);

        res.redirect('/inout');
    } catch (err) {
        console.error('Error adding attendance record:', err);
        res.status(500).send('Server error');
    }
};

// Update attendance (Time-Out)
const updateAttendance = async (req, res) => {
    try {
        const employeeId = req.session.employee_id;
        const { id } = req.params;
        const { time_out } = req.body;

        const [record] = await db.query(
            'SELECT * FROM attendance WHERE id = ? AND employee_id = ?',
            [id, employeeId]
        );

        if (record.length === 0) return res.status(403).send('Unauthorized access.');

        await db.query('UPDATE attendance SET time_out = ? WHERE id = ?', [time_out, id]);
        res.redirect('/inout');
    } catch (err) {
        console.error('Error updating attendance record:', err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getEmployeeAttendance,
    addAttendanceRecord,
    updateAttendance,
};
