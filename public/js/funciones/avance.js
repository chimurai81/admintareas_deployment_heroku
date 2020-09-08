import Swal from 'sweetalert2'

export const actualizarAvance = () =>{
    //seleccionamos las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ){
        //seleccionamos las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
        console.log(tareas.length)
        //calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length ) * 100);

        //mostrar el porcentaje del avance en pantalla
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance === 100){
            Swal.fire(
                'Tareas Finalizadas!',
                'Felicidades has completado con exito tus tareas',
                'success'
            )
        }
    }
}