const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const crypto = require('crypto')
const bcypt = require('bcrypt-nodejs')
const enviarEmail = require('../handlers/email')

//passport.authenticate pide la estrategia en este caso es local
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//funcion para verificar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res,next) =>{
    //si el usuario esta autenticado, continua su proceso normal

    if(req.isAuthenticated()){
        return next()
    }

    //si el usuario no esta autenticado, redirigimos hacia iniciar sesion
    return res.redirect('/iniciar-sesion')
}

//funcion para cerrar la sesion
exports.cerrarSesion = (req, res) => {
    
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion') //al cerrar sesion nos lleva a la ruta raiz, y al verificar 
                        //que no esta autenticado le manda a iniciar sesion
    })
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {

    //verificar si la cuenta existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({ where: { email } })
    //si el usuario no existe
    if(!usuario){
        req.flash('error', 'No existe esta Cuenta')
        res.redirect('/reestablecer')
    }
    //si el usuario si existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    //guardaamos en la db, no hace falta un update por que ya tenemos el objeto de usuario ya identificado mas arriba
    await usuario.save()

    //reseteamos la url por que necesitamos que tenga el identificador del token
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
    
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Recuperacion de contraseña AdminTareas',
        resetUrl,
        archivo: 'reestablecer-password'
    })

    //terminar el proceso
    req.flash('correcto', 'Se envio a tu correo, para cambiar la contraseña')
    res.redirect('/iniciar-sesion')

}

exports.validarToken = async (req, res ) => {
    //consulta por el token
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    })

    //si no encuentra el usuario con ese token
    if(!usuario){
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    //creamos un formulario para generar el nuevo pass
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer contraseña'
    })
}

//cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No Valido'),
        res.redirect('/reestablecer')
    }

    //hasheamos el nuevo password
    usuario.password = bcypt.hashSync(req.body.password, bcypt.genSaltSync(10))
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
}