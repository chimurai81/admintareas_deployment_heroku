import axios from 'axios'
import Swal from 'sweetalert2'
const tareas = document.querySelector('.listado-pendientes')
import {actualizarAvance} from '../funciones/avance'

if(tareas){
    tareas.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea
            
            //tenemos que hacer un request hacia /tarea/:id
            const url = `${location.origin}/tareas/${idTarea}`

            axios.patch(url, { idTarea })
                .then( function (respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo')

                        //para mostrar el avance de las tareas viene de ./public/js/funciones/avance
                        actualizarAvance()
                    }
            })
        }

        if(e.target.classList.contains('fa-trash')){
            //para obetener el id desde el html
            const tareaHTML = e.target.parentElement.parentElement, idTarea = tareaHTML.dataset.tarea; 
                //para mostrar la alerta
                Swal.fire({
                    title: 'Deseas Borrar Esta Tarea?',
                    text: "Si lo eliminas, no lo podras recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar!',
                    cancelButtonText: 'No, Cancelar'
                }).then((resultado) => {
                    if (resultado.value) {
                        const url = `${location.origin}/tareas/${idTarea}`

                        //enviar el delete por medio de axios 
                        axios.delete(url, { params: {idTarea}} )
                            .then( (respuesta) => {
                                if(respuesta.status === 200){
                                        //eliminamos el nodo
                                    tareaHTML.parentElement.removeChild(tareaHTML)
                                        //alerta opcional
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        respuesta.data,
                                        'success'
                                    )

                                    //para mostrar el avance de las tareas viene de ./public/js/funciones/avance
                                    actualizarAvance()
                                }
                            } )
                    }
                })
        }
    })
}

export default tareas