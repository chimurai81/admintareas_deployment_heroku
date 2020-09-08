const express = require ('express');
const routes = require('./routes'); //para poder usar las rutas de la carpeta routes
const path = require('path'); //es una forma de acceder a las carpetas, es decir el formato de rutas
const bodyParser = require('body-parser'); 
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
const helpers = require('./helpers.js') //importa el "helper" 
//realizamos la conexion a la DB
const db = require('./config/db');
require('dotenv').config({path: 'variables.env'}) //sirve para poder usar las variables glogables
// importar el modelo 
require('./models/Proyectos');
require('./models/Tareas')
require('./models/Usuarios')

db.sync()
   .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error))

//creamos una app de express
const app = express();

//cargando nuestros archivos estaticos, es decir lo  que va a ver el cliente o lo publico
app.use(express.static('public'));

//creando nuestros templates engines, habilitamos pug
app.set('view engine', 'pug');

//habilitamos body-parser para poder leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


//llamamos o añadimos las carpetas de la vista
app.set('views', path.join(__dirname, './views' ));

//agg flash messages
app.use(flash());

app.use(cookieParser())

//sessions nos permiten navegar entre distintas paginas sin volver a iniciar sesion
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())


//pasar vardump a la aplicacion esto lo que hace es convertir en un formato JSON.string
app.use( (req, res, next) => {
    res.locals.vardumps = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


//llamando a las rutas de mi carpeta routes
app.use('/', routes());

//para poner en escucha el servidor y puerto con las variables globales y sea compatible con heroku y localmente
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor chimurai esta funcionando correctamente')
})


