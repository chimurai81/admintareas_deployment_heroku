const sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid')//genera un id unico

const Proyectos = db.define('proyectos', {
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: sequelize.STRING
    },
    url:{
        type: sequelize.STRING
    }
}, {
    //un hooks funciona para poder realizar una accion antes o despues de cada insercion a la DB
    hooks: { 
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
}
);

module.exports = Proyectos;
