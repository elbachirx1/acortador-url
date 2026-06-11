document.addEventListener("DOMContentLoaded", function () {
  const botonAcortar = document.querySelector(".boton-acortar");
  const cajonTexto = document.getElementById("url");
  const formulario = document.querySelector(".seccion-form");

  const cajaResultado = document.createElement("div");
  cajaResultado.style.textAlign = "center";
  cajaResultado.style.marginTop = "20px";
  cajaResultado.style.display = "None";

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

  formulario.after(cajaResultado);

  const enlaceNuevo = document.getElementById("enlace-nuevo");
  const imagenQR = document.getElementById("imagen-qr");
  const botonDescargarQr = document.getElementById("boton-descargar-qr");
  const botonCopiar = document.getElementById("boton-copiar");

  botonAcortar.addEventListener("click", async function () {
    const urlOriginal = cajonTexto.value.trim();
    const passwordInput = document.getElementById("password-proteccion").value.trim();

    if (urlOriginal === "") {
      alert("ERROR | primero tienes que insertar un enlace");
      return;
    }

    botonAcortar.textContent = "Acortando...";
    botonAcortar.disabled = true; 
    cajaResultado.style.display = "none"; 

    try {
      const respuesta = await fetch("/api/corta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: urlOriginal,
          password: passwordInput ? passwordInput : null,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        enlaceNuevo.href = datos.short_url;
        enlaceNuevo.textContent = datos.short_url;

        botonCopiar.onclick = function () {
          navigator.clipboard.writeText(datos.short_url).then(() => {
            botonCopiar.textContent = "Copiado!";
            setTimeout(() => {
              botonCopiar.textContent = "Copiar";
            }, 2000);
          });
        };

        const urlApiQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(datos.short_url)}`;
        imagenQR.src = urlApiQr;

        botonDescargarQr.onclick = async function () {
          try {
            const resImg = await fetch(urlApiQr);
            const blob = await resImg.blob(); 
            const urlDescarga = window.URL.createObjectURL(blob);

            const linkTemporal = document.createElement("a");
            linkTemporal.href = urlDescarga;
            linkTemporal.download = `qr-mascorto.png`; 
            linkTemporal.click(); 
          } catch (e) {
            alert(
              "No se pudo descargar el QR directamente. Puedes hacer clic derecho sobre él para guardarlo.",
            );
          }
        };

        cajaResultado.style.display = "block";

        cajonTexto.value = "";
        document.getElementById("password-proteccion").value = "";
      } else {
        alert(datos.ERROR || "Algo salió mal al acortar.");
      }
    } catch (error) {
      console.error("Problema detectado:", error);
      alert("Hubo un problema de conexión.");
    } finally {
      botonAcortar.textContent = "Acortar";
      botonAcortar.disabled = false;
    }
  });
});