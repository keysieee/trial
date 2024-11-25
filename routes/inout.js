const express = require('express');
const router = express.Router();
const inoutController = require('../controller/inoutController');
const ensureAuthenticated = require('../middlewares/authMiddleware');

// Routes for in/out functionality
router.get('/inout', ensureAuthenticated, inoutController.getEmployeeAttendance);
router.post('/inout/add', ensureAuthenticated, inoutController.addAttendanceRecord);
router.patch('/inout/update/:id', ensureAuthenticated, inoutController.updateAttendance);

module.exports = router;
// Update attendance - Show form
exports.showUpdateAttendance = async (req, res) => {
    const { id } = req.params;
    try {
        const [attendanceRecord] = await db.query('SELECT * FROM attendance WHERE id = ?', [id]);
        if (!attendanceRecord) {
            return res.status(404).send("Record not found");
        }
        res.render('updateAttendance', { record: attendanceRecord });
    } catch (err) {
        console.error("Error fetching attendance record:", err);
        res.status(500).send("Server error");
    }
};

// Update attendance - Process form
exports.updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { time_in, time_out, branch, location } = req.body;
    const sql = 'UPDATE attendance SET time_in = ?, time_out = ?, branch = ?, location = ? WHERE id = ?';
    try {
        await db.query(sql, [time_in, time_out, branch, location, id]);
        res.redirect('/inout');
    } catch (err) {
        console.error("Error updating attendance record:", err);
        res.status(500).send("Server error");
    }
};

// Use PATCH or PUT instead of POST for updating
router.patch('/inout/update/:id', async (req, res) => {
    const { id } = req.params;
    const { time_in, time_out } = req.body;
    try {
        await db.query(
            'UPDATE attendance SET time_in = ?, time_out = ? WHERE id = ?',
            [time_in, time_out, id]
        );
        res.redirect('/inout');
    } catch (err) {
        console.error("Error updating attendance record:", err);
        res.status(500).send("Server error");
    }
});