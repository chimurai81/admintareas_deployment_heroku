const sequelize = require('sequelize')
const db = require('../config/db')
const bcypt = require('bcrypt-nodejs')
const Proyectos = require('../models/Proyectos')
const passport = require('passport')

const Usuarios = db.define('usuarios', {
    id:{
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    email:{
        type: sequelize.STRING(60),
        allowNull:false,
        validate:{
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
            notEmpty:{
                msg: 'La e-mail no puede ir vacia'
            }
        },
        unique:{
            args: true,
            msg: 'Usuario ya Registrado'
        }
    },
    password:{
        type: sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'La contraseña no puede ir vacia'
            }
        }
    },
    activo:{
        type: sequelize.INTEGER,
        defaultValue: 0
    },
    token:{
        type: sequelize.STRING
    },
    expiracion:{
        type: sequelize.DATE
    },
},
//aca vienen los hooks que cumplen funcionan antes o despues de insertar a la DB
{
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcypt.hashSync(usuario.password, bcypt.genSaltSync(10))
        }
    }
})

//metodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios