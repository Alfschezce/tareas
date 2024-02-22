require ("dotenv").config();
const postgres = require("postgres");

function conectar(){

    return postgres({
        host :process.env.DB_HOST,
        database:process.env.DB_NAME,
        user :process.env.DB_USER,
        password:process.env.DB_PASSWORD

    })
}
function getTareas(){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let tareas = await conexion `SELECT * FROM tareas`;
            conexion.end()
            
            ok(tareas);//pasa el array de tareas
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}

function crearTarea({tarea}){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{
            //aqui retorna un array [{id:3}] y lo desestructuro con {me quedo el 3}
            let [{id}] = await conexion `INSERT INTO  tareas (tarea) VALUES (${tarea}) RETURNING id`;
            conexion.end()
            
            ok(id);
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}

function borrarTarea(id){

    return new Promise(async(ok,ko)=>{

        let conexion = conectar();

        try{

            let {count} = await conexion `DELETE  FROM tareas WHERE id= ${id}`;
            conexion.end()
            
            ok(count);
        
        }catch(error){
            
            ko({error:"error en la base de datos"});
        }


    });
}

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

module.exports = {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto}