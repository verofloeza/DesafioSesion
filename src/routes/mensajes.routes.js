import MensajesDaos from "../daos/mensajes/MensajesDaosMongodb.js";
import UsuariosDaos from "../daos/usuarios/UsuariosDaos.js"
import express from "express";

const routerMensajes = express.Router();

const ApiMensajes = new MensajesDaos('MENSAJES');
const ApiUsuarios = new UsuariosDaos('username');

let MENSAJES;

routerMensajes.get( "/", async (req, res) => {
    if(!req.session.user){
        res.redirect('/login');
    }
    let USUARIO = req.session.user;
    MENSAJES = await ApiMensajes.getAll();
    console.log('ID del cliente:',req.sessionID);
    if(!MENSAJES){
        return res.status(404).json({ error });
    }else{
        return res.status(200).render('vista', {MENSAJES, USUARIO});
    }
})

routerMensajes.post( "/mensajes", async (req, res) => {
    await ApiMensajes.insertar(req.body);
    MENSAJES = await ApiMensajes.getAll();
    req.io.emit('from-server-mensajes', {MENSAJES});
    res.redirect('/');

});

routerMensajes.get('/login', (req, res)=> {
    const FORM_SESSION = "Formulario"
    return res.status(200).render('vista', {FORM_SESSION});
});

routerMensajes.get('/loginSession', async (req, res)=> {
    const { username } = req.query
    let USUARIO = await ApiUsuarios.getUsuario(username);
    if (!USUARIO) {
        return res.redirect('/login');
    }

    req.session.user = username;
    req.session.admin = true;
    
    res.redirect('/');
});

routerMensajes.get('/logout', (req, res)=> {
    let USUARIO = req.session.user;
    req.session.destroy(err=>{
        if (err) {
            res.json({err});
        } else {
            const DETROY_SESSION = "Formulario"
            return res.status(200).render('vista', {DETROY_SESSION, USUARIO});
        }
    });
});


export default routerMensajes;