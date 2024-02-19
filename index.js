require("dotenv").config();
const  express = require("express");
const {getTareas,crearTarea,borrarTarea}= require("./db");
const {json}= require("body-parser");

const servidor = express();

servidor.use(json());//aqui intercepta las peticiones y crea un objeto llamado body en dicha peticion


servidor.use("/pruebas",express.static("./pruebas_api"));

servidor.get("/api-todo",async (peticion,respuesta)=>{

    try{
    
        let tareas = await getTareas();

        respuesta.json(tareas);
    
    }catch(error){

        respuesta.status(500);
        
        respuesta.json(error);
    }

    
});

servidor.post("/api-todo/crear",async(peticion,respuesta,siguiente)=>{
    
    let {tarea} = peticion.body;

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

servidor.put("/api-todo",(peticion,respuesta)=>{

    respuesta.send("metodo PUT");
});

servidor.delete("/api-todo/borrar/:id",async(peticion,respuesta)=>{

    try{
        let cantidad = await borrarTarea(peticion.params.id);
        return respuesta.json({resultado :cantidad  ? "ok" : "ko"});

    }catch(error){

        respuesta.status(500);
        return respuesta.json(error);


    }

    
});



servidor.use((peticion,respuesta)=>{

    respuesta.status(404);

    respuesta.json({error : "not found"})
});
//una forma de control es esta//
servidor.use((error,peticion,respuesta,siguiente)=>{

    respuesta.status(400)// esto es bad request//

    respuesta.json({error : "peticion no valida"})
});

servidor.listen(process.env.PORT);