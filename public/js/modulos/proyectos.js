import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e) =>{
        const urlProyecto = e.target.dataset.proyectoUrl
        // console.log(urlProyecto)
            if(btnEliminar){
                Swal.fire({
                    title: 'Deseas Borrar Este Proyecto?',
                    text: "Si lo eliminas, no lo podras recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar!',
                    cancelButtonText: 'No, Cancelar'
                  }).then((result) => {
                    if (result.value) {
                        //enviar peticion a axios
                        const url = `${location.origin}/proyectos/${urlProyecto}`

                        axios.delete(url, { params: {urlProyecto}})
                            .then( (respuesta) => {
                                //console.log(respuesta);
                                Swal.fire(
                                    'Borrado!',
                                    'Tu proyecto ha sido eliminado.',
                                    'success'
                                  )
                                })
                                .catch(()=>{
                                    Swal.fire({
                                        type: 'error',
                                        icon: 'error',
                                        title: 'hubo un error',
                                        text: 'no se pudo eliminar el proyecto'
                                    })
                                })
                                //redireccionar despues de 3 seg
                                setTimeout( () =>{
                                    window.location.href = '/'
                                },2000)
                        }
                    })
                }
            })
}
                        

export default btnEliminar