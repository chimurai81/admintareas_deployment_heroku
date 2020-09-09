
const Proyectos = require('../models/Proyectos'); // importamos el modelo
const Tareas = require('../models/Tareas') // importamos el modelo de tarea

//estos son mis controladores
exports.proyectohome = async (req, res) => {
    // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
    const usuarioId = res.locals.usuario.id

    //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
    const proyectos = await Proyectos.findAll( { where: {usuarioId}}); //consultar al modelo "proyecto" y trae todos los datos

    res.render('index', {
        nombrePagina: "Proyectos",
        proyectos
    });
};

exports.formularioProyecto = async (req, res) =>{
   // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
   const usuarioId = res.locals.usuario.id

   //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
   const proyectos = await Proyectos.findAll( { where: {usuarioId: usuarioId}}); //consultar al modelo "proyecto" y trae todos los datos
    res.render('nuevoProyecto', {
        nombrePagina: "Nuevo Proyecto",
        proyectos
    });
};

exports.nuevoProyecto = async (req,res) =>{
    // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
    const usuarioId = res.locals.usuario.id

    //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
    const proyectos = await Proyectos.findAll( { where: { usuarioId }}); //consultar al modelo "proyecto" y trae todos los datos
    //req.body podemos ver los datos que  envia el formulario 
    //onsole.log(req.body);

    //validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = []
    
    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    //si hay errores    
    if(errores.length > 0){
        res.renderFile('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar a la DB
        const usuarioId = res.locals.usuario.id // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
        await Proyectos.create( {nombre, usuarioId} );
        res.redirect('/');
    }
    
};

exports.proyectoPorUrl = async (req, res, next) => {
    // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
    const usuarioId = res.locals.usuario.id

    //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
    const proyectosPromises = Proyectos.findAll( { where: {usuarioId: usuarioId}}); //consultar al modelo "proyecto" y trae todos los datos
    
    //hacemos la consulta solo por un elemento que es el url y por UsuarioId
    const proyectoPromises = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    //hacemos que el codigo(proyectosPromises y proyectoPromises) se ejecuten en paralelo
    const [proyectos, proyecto] = await Promise.all([proyectosPromises, proyectoPromises]);

    //consultamos a la tabla tareas por el proyectoId
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id,
        }
        ,
        // include: [
        //     { model: Proyectos}
        // ]
    });
    // console.log(tareas)

       //verificamos si el proyecto esta vacio o no. 
        if(!proyecto) return next();

        //renderizamos los datos hacia la vista
        res.render('tareas', {
            nombrePagina: 'Tareas del Proyecto',
            proyecto, 
            proyectos,
            tareas
        })
};

exports.formularioEditar = async(req, res) => {
    // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
    const usuarioId = res.locals.usuario.id

    //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
    const proyectosPromises = Proyectos.findAll( { where: {usuarioId: usuarioId}}); //consultar al modelo "proyecto" y trae todos los datos

    const proyectoPromises = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromises, proyectoPromises]);


    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: "Editar Proyecto",
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res) =>{
    // esto contiene el objeto con los datos de usuario que esta con la sesion iniciada
    const usuarioId = res.locals.usuario.id

    //hacemos la consulta por el idUsuario            //nombre de la tabla ,, //valor de la variable usuarioId
    const proyectos = await Proyectos.findAll( { where: {usuarioId: usuarioId}}); //consultar al modelo "proyecto" y trae todos los datos
    //req.body podemos ver los datos que  envia el formulario 
    //onsole.log(req.body);

    //validar que tengamos algo en el input
    const { nombre = req.body.nombre } = req.body;

    let errores = []
    
    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    //si hay errores    
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //insertar a la DB
        await Proyectos.update(
            { nombre: nombre }, 
            {
                where: {id: req.params.id}
            }
        );

        res.redirect('/');
    }
    
};

//eliminar el proyecto
exports.eliminarProyecto = async (req, res, next) => {
    //req, body o params
    //console.log(req.params)

    const {urlProyecto} = req.query 
    const resultado = await Proyectos.destroy({where: {
        url: urlProyecto
    }})
    //manejamos si existe un error
    if(!resultado){
        return next() //que se vaya al siguente middleware
    }

    res.send('Tarea eliminada exitosamente')
}