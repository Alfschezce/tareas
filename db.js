require ("dotenv").config();
const postgres = require("postgres");
//funcion para conectarse al servidor//
function conectar(){

    return postgres({
        host :process.env.DB_HOST,
        database:process.env.DB_NAME,
        user :process.env.DB_USER,
        password:process.env.DB_PASSWORD

    })
}
//funcion para que me de la base de datos las  tareas//
function getTareas(){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let tareas = await conexion `SELECT * FROM tareas`;
            conexion.end()
            
            ok(tareas);//devuelve la promesa pasando al index.js el array de tareas
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}
//funcion para crear una tarea en la base de datos//
function crearTarea({tarea}){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{
            //aqui retorna un array [{id:3}] y lo desestructuro con {me quedo el 3}
            let [{id}] = await conexion `INSERT INTO  tareas (tarea) VALUES (${tarea}) RETURNING id`;
            conexion.end()
            
            ok(id);//se devuelve la promesa al index.js el id
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}
//funcion para borrar una tarea en la base de datos//
function borrarTarea(id){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let {count} = await conexion `DELETE  FROM tareas WHERE id= ${id}`;
            conexion.end()
            
            ok(count);//sera 0 si no lo ha borrado o 1 si lo ha borrado
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}
//funcion para actualizar el estado de la tarea terminada o no terminada//
function actualizarEstado(id){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let {count} = await conexion `UPDATE tareas SET terminada = NOT terminada WHERE id= ${id}`;
            conexion.end()
            
            ok(count);
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}
//funcion para actualizar el texto cuando lo cambiamos en la tarea//
function actualizarTexto(id,tarea){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let {count} = await conexion `UPDATE tareas SET tarea = ${tarea} WHERE id= ${id}`;
            conexion.end()
            
            ok(count);
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}
//exportamos todo//
module.exports = {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto}