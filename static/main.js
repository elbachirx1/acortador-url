
// esperamos a que el html cargue 
document.addEventListener('DOMContentLoaded', function() {

    // buscar los elementos necesarios en index.html para poder controlarlos desde aqui
    const botonAcortar = document.querySelector('.boton-acortar');
    const cajonTexto = document.getElementById('url');
    const formulario = document.querySelector('.seccion-form');

    // creamos lugar visual pa mostrar el resultado
    const cajaResultado = document.createElement('div');
    cajaResultado.style.textAlign = 'center';
    cajaResultado.style.marginTop = '20px';
    cajaResultado.style.display = 'None';
    
    // Le metemos un texto y un enlace vacío que luego rellenaremos con la url corta
    cajaResultado.innerHTML = `
        <p style="font-size: 18px; margin-bottom: 5px; color: #333;">Aquí tienes tu enlace:</p>
        <a id="enlace-nuevo" href="#" target="_blank" style="font-size: 22px; font-weight: bold; color: rgb(112, 202, 255); text-decoration: none;"></a>
    `;

    // lo pegamos en la pagina justo debajo del formulario
    formulario.after(cajaResultado);

    // guardamos ese enlace vacio en una variable para cambiarle el texto mas adelante 
    const enlaceNuevo = document.getElementById('enlace-nuevo');

    // hacemos que el boton este atento a cuando el usuario le haga click
    botonAcortar.addEventListener('click', async function () {

        // cogemos el texto insertado y lo limpiamos de espacios
        const urlOriginal = cajonTexto.value.trim();

        if (urlOriginal === '') {
            alert('ERROR | primero tienes que insertar un enlace');
            return;
        }

        // cambiamos el texto del boton
        botonAcortar.textContent = 'Acortando...';
        botonAcortar.disabled = true; // desactivamos el boton pa evitar doble click
        cajaResultado.style.display = 'none'; // ocultamos resultados anteriores si los hubiera

        try {
            // 'fetch' es la herramienta de JavaScript para hablar con servidores.
            const respuesta = await fetch('/api/corta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Empaquetamos la URL en un formato (JSON)  Python pueda leer
                body: JSON.stringify({ url: urlOriginal })
            });

            // Esperamos a que Python procese, guarde en Supabase y nos conteste
            const datos = await respuesta.json();

            if (respuesta.ok) {

                // rellenamos el espacio vacio con lo que nos dio python
                enlaceNuevo.href = datos.short_url;
                enlaceNuevo.textContent = datos.short_url;

                cajaResultado.style.display = 'block';

                // limpiamos el input de texto para que puedan meter otro enlace nuevo
                cajonTexto.value = '';
            } else { // si nos devuelve error
                alert(datos.ERROR || 'Algo salió mal al acortar.');
            }

        } catch (error) {
            //  salta si el servidor de Python está apagado o si el usuario no tiene internet
            console.error('Problema detectado:', error);
            alert('Hubo un problema de conexión. Por favor, revisa tu internet o inténtalo de nuevo en unos minutos.');
        } finally {
            // volvemos a dejar el boton como antes
            botonAcortar.textContent = 'Acortar';
            botonAcortar.disabled = false;

        }
    });

});


        





