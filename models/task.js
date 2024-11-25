const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Replace with your database config file

const Task = sequelize.define('Task', {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Task;
