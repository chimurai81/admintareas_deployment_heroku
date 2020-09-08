const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req, res) =>{
    res.render( 'crearCuenta', {
        nombrePagina: 'Crear Cuenta en AdminTareas'
    })
}

exports.formIniciarSesion = (req, res) =>{
    const { error } = res.locals.mensajes
    res.render( 'inciarSesion', {
        nombrePagina: 'Iniciar Sesion en AdminTareas',
        error
    })
}

exports.crearCuenta = async (req, res) =>{
   //leer los datos
   const {email, password} = req.body
    
   try {
      //crear el usuario
        await Usuarios.create({
            email,
            password
        }) 

        //crear el una url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
        //crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta en AdminTareas',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })
        //redirigir al usuario y mostramos un mensaje 
        req.flash('correcto', 'enviamos un correo, favor confirma tu cuenta')

        res.redirect('/iniciar-sesion')
   } catch (error) {
       //usamos flash para poder almacenar todos los errores o mensajes en un objeto y que sea mas manejable.
       req.flash('error', error.errors.map(error => error.message ))
       res.render('crearCuenta' ,{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en AdminTareas',
            email : email,
            password: password
       })
   }
} 

exports.formRestablecerPassword = (req, res) =>{
    res.render('reestablecer', {
        nombrePagina: 'Restablecer tu password'
    })
}

//para cambiar el estado de la cuenta
exports.confirmarCuenta = async (req, res) => {

    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'Este correo no existe, en AdminTareas')
        res.redirect('/crear-cuenta')
    }

    //si el usuario si existe
    usuario.activo = 1;
    await usuario.save()

    req.flash('correcto', 'Cuenta Creada con exito')
    res.redirect('/iniciar-sesion')
}