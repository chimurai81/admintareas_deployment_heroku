const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController.js');
const tareasController = require('../controllers/tareasController.js')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')
const { body } = require('express-validator'); //importamos la validacion de express para el body tambien se puede para el params

//estas son mis rutas
module.exports =  function() {

    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectohome
    );

    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(), //realizamos la validacion al campo nombre, para ingresar limpio a la DB
        proyectosController.nuevoProyecto //este viene de mi controlador
    );

     // Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

     //Actualizar el proyecto es decir un consulta
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    //para poder hacer un update en mi DB
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), //realizamos la validacion al campo nombre, para ingresar limpio a la DB
        proyectosController.actualizarProyecto //este viene de mi controlador
    );

    //eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    //router TAREAS
    //para poder insertar una nueva tarea
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar las tareas con patch con con update
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //elimimanos las tareas 
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTareas
    );

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    //crear nueva cuenta pero este es el metodo post
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    //para confirmar la cuenta que se envia desde el correo
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)
    
    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)
    
    //reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)
    return router
};