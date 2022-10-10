import { config } from '../utils/config.js';
import mongoose from "mongoose";
import { usuariosModel } from '../model/usuarios.model.js';

const strConn = config.atlasUsuarios.strConn;
let objs;
class ModelsUsuarios{
    constructor(){}

    async getUsuario(usuario){
        try {
            await mongoose.connect(strConn);
            objs = await usuariosModel.find({username: { $eq: usuario }});
            console.log('find:', objs[0].username)
            return objs[0].username;
           
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }
}

export default ModelsUsuarios;