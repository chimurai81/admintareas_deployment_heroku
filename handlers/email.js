const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util') //ayuda a poder soportar en async/await en caso no lo soporte por default
const emailConfig = require('../config/email')

let transport = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass 
      },
  });

//genramos el html que se va a mostrar en el correo de cambio de password
const generarHtml = (archivo, opciones={}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
};

exports.enviar = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones );
    const text = htmlToText.fromString(html);

    let opcionesEmail = {
        from: 'Admin Tareas <no-responder@admintareas.com>', // sender address
        to: opciones.usuario.email, 
        subject: opciones.subject, 
        html,
        text
      };

      const enviarEmail = util.promisify(transport.sendMail, transport);
      return enviarEmail.call(transport, opcionesEmail);  
};


