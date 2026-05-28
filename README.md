# MásCorto 

MasCorto es una aplicación web de tipo SaaS diseñada para transformar URLs extensas y propensas a errores en cadenas cortas, seguras y fácilmente memorizables bajo un dominio propio.

**Enlace del proyecto:** [https://mascorto.onrender.com/](https://mascorto.onrender.com/)

---

## Características Principales

* **Generación de enlaces y códigos QR:** El sistema procesa el enlace original y genera en paralelo un código QR escaneable (150x150px) mediante una API de renderizado gráfico vectorial.
* **Control de enlaces temporales:** Permite establecer una fecha y hora exacta de expiración. El backend utiliza un algoritmo sincronizado bajo el estándar UTC para evitar desajustes por zonas horarias.
* **Protección por contraseña:** El backend intercepta la solicitud HTTP en enlaces protegidos, bloquea la redirección directa y muestra una interfaz secundaria de validación de credenciales.

---

## Arquitectura y Tecnologías

### Backend
* **Python & Flask:** Microframework ligero que ofrece alta velocidad de respuesta y un manejo eficiente del enrutamiento dinámico.
* **API goqr.me:** Plataforma en línea integrada para la generación rápida y automatizada de códigos QR.

### Base de Datos
* **Supabase:** Plataforma Backend-as-a-Service (BaaS) que aloja la infraestructura del proyecto.
* **PostgreSQL:** Motor relacional de Supabase que garantiza transacciones seguras, indexación veloz y persistencia de datos estable.

### Frontend
* **HTML5 & CSS3:** Estructura semántica y diseño visual de la interfaz de usuario.
* **JavaScript (Vanilla):** Programación reactiva basada en eventos con uso de la API `fetch` para la comunicación asíncrona con el servidor.

---

## Estructura de la Base de Datos

### Tabla: `urls`


| Columna | Tipo de Dato | Restricciones / Atributos |
| :--- | :--- | :--- |
| `id` | `int8` | Clave primaria (PK) |
| `created_at` | `timestamptz` | No nulo / Zona horaria incluida |
| `short_code` | `text` | Único |
| `original_url` | `text` | No nulo |
| `expires_at` | `timestamptz` | Permite NULL |
| `password` | `text` | Permite NULL |

---

## Estructura del Proyecto

```text
mascorto-app/
│
├── app.py
├── .env
├── requirements.txt
│
├── static/
│   ├── estilos.css
│   ├── main.js
│   └── logo_web.png
│
└── templates/
    ├── index.html
    └── password.html
```
