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
            objs = await usuariosModel.findOne({username: { $eq: usuario }});
            console.log('find:', objs)
            return objs;
           
          } catch (error) {
            console.log(error)
        } finally {
            await mongoose.disconnect()
        }
    }
}

export default ModelsUsuarios;