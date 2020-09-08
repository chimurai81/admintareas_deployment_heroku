const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios')

//local strategy - login crea con credenciales propias (usuario y pass)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y pass, entonces renombramos los campos con
        //usernameField y passwordField
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email : email,
                        activo: 1
                    }
                    })
                //el usuario existe, password incorrecto    
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })   
                }
                //el email existe el password es correcto
                return done(null, usuario) //esto devuelve un objeto
            } catch (error) {
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario (es decir: para que sea un objeto en conjunto)
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario)
})


//deserializar el usuario (es decir: para que se pueda separar datos del objeto)
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario)
})

//exportamos todo esto por que ya estamos verificando al usuario que se quiere autenticar
module.exports = passport