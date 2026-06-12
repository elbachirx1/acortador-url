# MasCorto - Acortador de Enlaces

**Enlace web del proyecto:** [https://mascorto.onrender.com/](https://mascorto.onrender.com/)

**MasCorto** es una aplicación web de tipo SaaS (Software as a Service) cuyo propósito central es transformar URLs extensas, complejas y propensas a errores de distribución en cadenas cortas y fácilmente memorizables bajo un dominio propio.

---

## Características Principales

* **Generación de Enlaces y Códigos QR:** Cada vez que el sistema procesa un enlace original, genera en paralelo un código QR escaneable (150x150px) de forma automática gracias a la integración con una API externa de renderizado de gráficos vectoriales.
* **Protección de Accesos por Contraseña:** Si un usuario configura un enlace como protegido, el backend intercepta la solicitud HTTP, bloquea la redirección directa al destino y muestra una interfaz web secundaria de validación donde se exige insertar la clave secreta para poder acceder.

---

## Arquitectura y Tecnologías Utilizadas

| Componente | Tecnología | Función Principal |
| :--- | :--- | :--- |
| **Backend** | Python & Flask | Microframework caracterizado por su alta velocidad de respuesta, bajo consumo de recursos y excelente manejo del enrutamiento dinámico de URLs. |
| **API Externa** | goqr.me | Plataforma gratuita en línea utilizada para generar y renderizar los códigos QR de manera asíncrona, rápida y sencilla. |
| **Base de Datos** | Supabase | Plataforma Backend-as-a-Service (BaaS) basada en arquitectura empresarial para la gestión en la nube. |
| **Motor SQL** | PostgreSQL | Motor relacional usado por Supabase. Garantiza transacciones seguras, indexación de alta velocidad y persistencia de datos estable. |
| **Frontend** | JavaScript Vanilla | Programación reactiva basada en eventos del DOM. Utiliza la API moderna `fetch` para comunicarse con el servidor en segundo plano sin recargar. |
| **Interfaz** | HTML5 & CSS3 | Estructura de contenido semántico y hojas de estilo para el diseño web responsivo de la aplicación. |

---

## Estructura de la Base de Datos

El sistema utiliza una tabla central unificada para gestionar las redirecciones y la seguridad de los enlaces.

**Nombre de la tabla:** `urls`

| Columna | Tipo de Dato SQL | Restricciones / Atributos |
| :--- | :--- | :--- |
| `id` | int8 (BigInt) | Clave Primaria / Autoincremental |
| `created_at` | timestamptz | No Nulo / Incluye zona horaria |
| `short_code` | text | Único (Indexado para búsquedas rápidas) |
| `original_url` | text | No Nulo |
| `password` | text | Permite NULL (Opcional) |

---

## Estructura del Árbol del Proyecto

El código fuente está estructurado bajo los estándares profesionales de organización de Flask, separando la lógica del servidor de los recursos estáticos y visuales:

```text
mascorto-app/ 
│ 
├── app.py                  # Servidor principal (rutas y lógica de backend)
├── .env                    # Variables de entorno confidenciales (claves BD)
├── requirements.txt        # Dependencias de Python para el despliegue
│ 
├── static/                 # Archivos estáticos públicos
│   ├── estilos.css         # Hoja de estilos del diseño web
│   ├── main.js             # Lógica del cliente y consumo de API
│   └── logo_web.png        # Identidad visual
│ 
└── templates/              # Vistas HTML (Motor Jinja2)
    ├── index.html          # Interfaz principal generadora de enlaces
    └── password.html       # Interfaz secundaria de seguridad (candado)
