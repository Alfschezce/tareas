const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const input = document.querySelector('form input[type="text"]');
//aqui escribimos a mano lo que sea la tarea y hace un nuevo div//
//new Tarea(12,"lo que escribimos en el formulario",true,contenedorTareas)//
//en este caso no lo escribimos a mano sino que me lo traigo de mi api//
//con esto leemos y representamos las tareas que nos traemos en un array
fetch("/api-todo")
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas);
    });
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if(/^[a-záéíóúñü][a-záéíóúñü0-9 ]*$/i.test(input.value)){
        return fetch("/api-todo/crear",{
            method : "POST",
            body : JSON.stringify({ tarea : input.value }),//lo que escribe el usuario
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())//hacemos json para extraer la respuesta
        .then(({id}) => {
            if(id){//si hay id retornare una nueva tarea 
                new Tarea(id,input.value.trim(),false,contenedorTareas);
                return input.value = "";//aqui el valor del input(lo que escribimos) se limpia despues
            }
            console.log("..error creando la tarea");
        });
    }
    console.log("..error en el formulario");
});