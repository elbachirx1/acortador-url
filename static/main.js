
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
        <p style="font-size: 18px; margin-bottom: 5px; color: #333;">¡Aquí tienes tu enlace!</p>
        
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 15px;">
            <a id="enlace-nuevo" href="#" target="_blank" style="font-size: 22px; font-weight: bold; color: rgb(112, 202, 255); text-decoration: none;"></a>
            <button id="boton-copiar" type="button" style="padding: 6px 12px; font-size: 14px; cursor: pointer; background-color: #eee; color: #333; border: 1px solid #ccc; border-radius: 4px; font-weight: bold;">
                Copiar
            </button>
        </div>
        
        <div id="contenedor-qr" style="margin: 20px 0;">
            <img id="imagen-qr" src="" alt="Código QR" style="border: 4px solid #fff; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); max-width: 150px; display: inline-block;">
        </div>

        <button id="boton-descargar-qr" type="button" style="padding: 8px 15px; font-size: 14px; cursor: pointer; background-color: #333; color: white; border: none; border-radius: 4px;">
            Descargar Código QR
        </button>
    `;

    // lo pegamos en la pagina justo debajo del formulario
    formulario.after(cajaResultado);

    // guardamos ese enlace vacio en una variable para cambiarle el texto mas adelante 
    const enlaceNuevo = document.getElementById('enlace-nuevo');
    const imagenQR = document.getElementById('imagen-qr');
    const botonDescargarQr = document.getElementById('boton-descargar-qr');
    const botonCopiar = document.getElementById('boton-copiar');

    // hacemos que el boton este atento a cuando el usuario le haga click
    botonAcortar.addEventListener('click', async function () {

        // cogemos el texto insertado y lo limpiamos de espacios
        const urlOriginal = cajonTexto.value.trim();

        // captar dia y hora
        const fechaCaducidadInput = document.getElementById('fecha-caducidad').value;
        let fechaParaServidor = null;

        // Si el usuario eligió una fecha, la traducimos a Horario Universal (UTC)
        if (fechaCaducidadInput) {
            const fechaLocal = new Date(fechaCaducidadInput);
            fechaParaServidor = fechaLocal.toISOString();
        }

        const passwordInput = document.getElementById('password-proteccion').value.trim()

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
                body: JSON.stringify({
                    url: urlOriginal,
                    expires_at: fechaParaServidor,
                    password: passwordInput ? passwordInput : null
                })
            });

            // Esperamos a que Python procese, guarde en Supabase y nos conteste
            const datos = await respuesta.json();

            if (respuesta.ok) {

                // rellenamos el espacio vacio con lo que nos dio python
                enlaceNuevo.href = datos.short_url;
                enlaceNuevo.textContent = datos.short_url;

                // logica de boton copiar
                botonCopiar.onclick = function() {
                    navigator.clipboard.writeText(datos.short_url).then(() => {
                        botonCopiar.textContent='Copiado!';
                        // a los 2 seg vuelve a poner copiar
                        setTimeout(() => {
                            botonCopiar.textContent = 'Copiar'
                        }, 2000);
                    });
                };

                // Llamamos a la API usando la nueva url corta
                // le pedimos tamaño 150x150px
                const urlApiQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(datos.short_url)}`;
                imagenQR.src = urlApiQr;

                // configuramos el boton de descarga
                botonDescargarQr.onclick = async function() {
                    try {
                        const resImg = await fetch(urlApiQr);
                        const blob = await resImg.blob(); // convertir la imagen en un archivo descargable
                        const urlDescarga = window.URL.createObjectURL(blob);

                        const linkTemporal = document.createElement('a');
                        linkTemporal.href = urlDescarga;
                        linkTemporal.download = `qr-mascorto.png`; // nombre del archivo que se bajará
                        linkTemporal.click(); // forzamos la descarga del usuario
                    } catch (e) {
                        alert('No se pudo descargar el QR directamente. Puedes hacer clic derecho sobre él para guardarlo.');
                    }
                };

                cajaResultado.style.display = 'block';

                // limpiamos el input de texto para que puedan meter otro enlace nuevo
                cajonTexto.value = '';
                document.getElementById('fecha-caducidad').value = ''; // limpiar input de fecha
                document.getElementById('password-proteccion').value = '';

            } else { // si nos devuelve error
                alert(datos.ERROR || 'Algo salió mal al acortar.');
            }

        } catch (error) {
            //  salta si el servidor de Python está apagado o si el usuario no tiene internet
            console.error('Problema detectado:', error);
            alert('Hubo un problema de conexión.');
        } finally {
            // volvemos a dejar el boton como antes
            botonAcortar.textContent = 'Acortar';
            botonAcortar.disabled = false;
        }
    });
});


        





