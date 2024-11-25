const db = require('../config/db');

// Fetch all tasks using async/await
exports.getTasks = async (req, res) => {
    try {
      const [results] = await db.query('SELECT * FROM tasks');
      res.render('tasks', { tasks: results });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).send("Server error");
    }
  };
  
// Add a new task
exports.addTask = async (req, res) => {
    const { description } = req.body;
    const sql = 'INSERT INTO tasks (description, completed) VALUES (?, ?)';
    try {
      await db.query(sql, [description, false]);
      res.redirect('/tasks');
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).send("Server error");
    }
  };
  
  // Toggle task completion
  exports.toggleTask = async (req, res) => {
    const { id } = req.params;
    try {
      const [results] = await db.query('SELECT completed FROM tasks WHERE id = ?', [id]);
      const completed = !results[0].completed;
      await db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id]);
      res.redirect('/tasks');
    } catch (err) {
      console.error("Error toggling task:", err);
      res.status(500).send("Server error");
    }
  };
  
  // Delete a task
  exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM tasks WHERE id = ?', [id]);
      res.redirect('/tasks');
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).send("Server error");
    }
  };
  
