import * as dotenv from 'dotenv'

import express, { urlencoded } from "express";

import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { config } from './src/utils/config.js';
import { engine } from 'express-handlebars';
import { join } from "path";
import routerMensajes from "./src/routes/mensajes.routes.js";
import routerProductos from './src/routes/productos.routes.js';
import session from "express-session";

const app = express();
dotenv.config();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const strConn = config.atlasSesion.strConn;

// /*-------------------Middleware-------------------------*/
app.use(urlencoded({ extended: true}));
app.use(express.static('./public'));

//Session Setup
app.use(session({
    store: strConn,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}))

//Motor de plantillas
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.set('views', join( './views'));
app.set('view engine', 'hbs');
app.set('socketio', io);

// /*-------------------Rutas-------------------------*/
app.use((req, res, next) => {
    req.io = io;
    return next();
  });

app.use("/", routerMensajes);


  app.get('*', (req, res)=>{
    res.status(404).json({ error: ` -2, descripcion: /${req.url} ${req.method} - No implementada` })
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
     error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error.'
     }
    });
   });

   /* ---------------------- WebSocket ----------------------*/
io.on('connection', (socket)=>{

    console.log(`Nuevo cliente conectado! ${socket.id}`);
  });
  
/* ---------------------- Servidor ----------------------*/
const server = httpServer.listen(process.env.PORT, ()=> {
    console.log(`Servidor escuchando en el puerto http://localhost:${process.env.PORT}`)
});

server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});
