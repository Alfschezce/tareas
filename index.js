require("dotenv").config();
const  express = require("express");
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto}= require("./db");
const {json}= require("body-parser");
const cors = require("cors");

const servidor = express();

servidor.use(cors());// para unir diferentes dominios

servidor.use(json());// todas las peticiones pasan por aqui y crea un objeto llamado body en la peticion


servidor.use("/pruebas",express.static("./estaticos"));
//peticion para servir//
servidor.get("/api-todo",async (peticion,respuesta)=>{

    try{
    
        let tareas = await getTareas();

        respuesta.json(tareas);
    
    }catch(error){

        respuesta.status(500);
        
        respuesta.json(error);
    }

    
});
//peticion para crear//
servidor.post("/api-todo/crear",async(peticion,respuesta,siguiente)=>{
    
    let {tarea} = peticion.body;//aqui extraigo la tarea de peticion.body

    if(tarea && tarea.trim() !="" ){

        try{

            let id = await crearTarea({tarea});
            return respuesta.json({id});
        
        }catch(error){

            respuesta.status(500)
            return respuesta.json(error)
        }
    }

    siguiente({ error : "falta el argumento tarea del objeto JSON"})
});
//peticion para actualizar
//aqui tiene que llevar el id( que sera un numero) y la operacion que queremos hacer 1 que sera editar texto, o 2 que sera toogle de terminada
servidor.put("/api-todo/actualizar/:id([0-9]+)/:operacion(1|2)",async(peticion,respuesta)=>{

    //si operacion es 1 lo que queremos es actualizar el texto//      
    if(peticion.params.operacion== 1){

        let {tarea} = peticion.body;//extraigo la tarea de peticion.body//

        if(tarea && tarea.trim() !=""){

            try{
    
                let cantidad = await actualizarTexto(peticion.params.id,tarea);
                return respuesta.json({resultado :cantidad  ? "ok" : "ko"});
            
            }catch(error){
    
                respuesta.status(500)
                return respuesta.json(error)
            }
            

    }
    siguiente({ error : "falta el argumento tarea del objeto JSON"})
    //sino es 1 pues sera 2 que lo que queremos es actualizar estado de terminada a no terminada//
}else{
        try{
    
            let cantidad = await actualizarEstado(peticion.params.id);
            return respuesta.json({resultado :cantidad  ? "ok" : "ko"});
        
        }catch(error){

            respuesta.status(500)
            return respuesta.json(error)
        }


    }
    
            
});
//peticion para borrar//
servidor.delete("/api-todo/borrar/:id([0-9]+)",async(peticion,respuesta)=>{

    try{
        let cantidad = await borrarTarea(peticion.params.id);//params.id coge el parametro id de lo que hemos escrito en el front, en este caso un 2 por ejempplo//
        return respuesta.json({resultado :cantidad  ? "ok" : "ko"});//devuelve un objeto que tiene que ser 0 o 1, si es 0 no lo ha borrado si es 1 si

    }catch(error){

        respuesta.status(500);
        return respuesta.json(error);


    }

    
});


//cuando nada encaja en las peticiones
servidor.use((peticion,respuesta)=>{

    respuesta.status(404);

    respuesta.json({error : "not found"})
});
//si las cosas  no vienen bien en la peticion, o no es formato json etc//
servidor.use((error,peticion,respuesta,siguiente)=>{

    respuesta.status(400)// esto es bad request//

    respuesta.json({error : "peticion no valida"})
});

servidor.listen(process.env.PORT);