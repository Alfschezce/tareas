class Tarea{
    // El constructor recibe cuatro parámetros: id, textoTarea, estado y contenedor
    constructor(id,textoTarea,estado,contenedor){
        this.id = id;
        this.textoTarea = textoTarea;
        this.DOM = null;//componente HTML TODO EL CUADRADO el div tareas
        this.editando = false;
        // Se llama al método crearComponente dentro del constructor
        this.crearComponente(estado,contenedor);
    }
    // Método para crear el componente HTML de la tarea y agregarlo al contenedor especificado
    crearComponente(estado,contenedor){
        // Se crea un nuevo elemento div que representará la tarea
        this.DOM = document.createElement("div");
        // Se agrega la clase "tarea" al elemento div
        this.DOM.classList.add("tarea");

        //creamos el texto
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.textoTarea;

        //creamos el input
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type","text");
        inputTarea.value = this.textoTarea;

        //creamos el boton editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => this.editarTarea());//esto ultimo se escribe para que pase el this externo es decir el de arriba,

        //creamos el boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "borrar";

        
        botonBorrar.addEventListener("click",() => this.borrarTarea());//esto ultimo se hace para que pase el this externo, es decir el de arriba

        //creamos el boton estado
        let botonEstado = document.createElement("button");
        botonEstado.classList.add("estado", estado ? "terminada" : null);
        botonEstado.appendChild(document.createElement("span"));
        //aqui el callback sube desde la promesa de la funcion toggle estado
        botonEstado.addEventListener("click", () => {
            this.toggleEstado().then(({resultado}) =>{ 
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada");
                }
                console.log("error actualizando");
            });
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(inputTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    //ponemos los metodos//
    borrarTarea(){
        fetch("/api-todo/borrar/" + this.id, {
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())//hacemos json para extraer la respuesta
        .then(({resultado}) => {
            if(resultado == "ok"){
                return this.DOM.remove();
            }
            console.log("..error al borrar");
        });
        
    }
    toggleEstado(){
        return fetch(`/api-todo/actualizar/${this.id}/2`,{//fetch retorna una promesa que se engancha al addEventListener del boton
            method : "PUT"
        })
        .then(respuesta => respuesta.json()); //hacemos json para extraer la respuesta y como se ha cumplido sube al boton tooglestado
    }
    async editarTarea(){
        if(this.editando){
            //guardar
            let textoTemporal = this.DOM.children[1].value;//lo que escribe el usuario
            //con esta parte de ahora le decimos que si el texto realmente ha cambiado y no lo ha dejado en blanco
            if(textoTemporal.trim() != "" && textoTemporal.trim() != this.textoTarea){
                let {resultado} = await fetch(`https://api-todo-clase-23t8.onrender.com/api-todo/actualizar/${this.id}/1`,{//resultado traera un objeto asi {resultado :ok ,ko} y lo desestructuro
                                            method : "PUT",
                                            body : JSON.stringify({ tarea : textoTemporal.trim() }),
                                            headers : {
                                                "Content-type" : "application/json"
                                            }
                                        })
                                        .then(respuesta => respuesta.json());
                if(resultado == "ok"){
                    this.textoTarea = textoTemporal;//aqui actualizo el front-end una vez que se ha actualizado el back-end es decir si es ok
                }                        
            }


            this.DOM.children[0].innerText = this.textoTarea;// le pones al h2 el nuevo valor que le corresponde si se edita
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[2].innerText = "editar";
            this.editando = false;
        }else{
            //editar
            this.DOM.children[0].classList.remove("visible");//es el h2
            this.DOM.children[1].value = this.textoTarea;//lo que escribe el usuario al editar
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "guardar";
            this.editando = true;
        }
    }
}