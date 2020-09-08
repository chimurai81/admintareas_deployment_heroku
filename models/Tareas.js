const sequelize = require('sequelize');
const db = require('../config/db');
const { Sequelize } = require('sequelize');
const Proyectos = require('./Proyectos');

 const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
 });

 Tareas.belongsTo(Proyectos); //esto hace que se genere un llave foranea en Tareas y se relacione con la tabla proyectos.

 module.exports = Tareas