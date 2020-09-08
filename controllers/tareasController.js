const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) =>{
    //obtenemos 1 proyecto con la condicion que el campo url de la DB sea igual al del proyecto 
    const proyecto = await Proyectos.findOne({ where: {url: req.params.url}});
    
    //leer valor del input
    const {tarea} = req.body

    //estado= 0 incompleto, y el ID del proyecto
    const estado = 0
    const proyectoId = proyecto.id

    //insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId})

    if(!resultado){
        return next()
    }

    //redireccionamos
    res.redirect(`/proyectos/${req.params.url}`)
};

exports.cambiarEstadoTarea = async (req, res) =>{
    const { id } = req.params
    //hacemos la consulta a la db por el id de la tarea
    const tarea = await Tareas.findOne({ where: { id }})

    //cambiamos el estado 
    let estado = 0
    if(tarea.estado === estado){
        estado = 1
    }
    tarea.estado = estado

    const resultado = await tarea.save()

    if(!resultado) return next()

    res.status(200).send('Actualizado')
}

exports.eliminarTareas = async (req, res) => {
    const {id} = req.params

    //eliminar la tarea por el id
    const resultado = await Tareas.destroy( {where: { id }})
    
    if(!resultado) return next()

    res.status(200).send('Tarea Eliminada Correctamente')
}