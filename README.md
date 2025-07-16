# 📚 Libros Vecinos: Tu Plataforma de Intercambio de Libros

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=nodedotjs)
![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-4EA94B?logo=mongodb)
![Mongoose](https://img.shields.io/badge/Mongoose-7.x-800000?logo=mongoose)
![Jest](https://img.shields.io/badge/Jest-29.x-C21325?logo=jest)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-20.x-2088FF?logo=githubactions)

## ✨ ¿Qué es Libros Vecinos?

**Libros Vecinos** es una plataforma web diseñada para conectar a amantes de la lectura que desean intercambiar libros de forma gratuita en su comunidad. Dale una segunda vida a tus libros, descubre nuevas lecturas y fomenta un ciclo de compartir y aprender.

### 🎯 Características Principales

* **Publica tus Libros:** Sube fácilmente los libros que deseas intercambiar, con detalles como título, autor, género y estado.
* **Explora y Encuentra:** Busca libros por categoría, autor o título disponibles en tu vecindario.
* **Solicita Intercambios:** Envía solicitudes a otros usuarios para iniciar un intercambio.
* **Gestión de Perfil:** Crea y administra tu perfil de usuario, incluyendo tus libros disponibles y tus intereses de lectura.

## 🚀 Cómo Empezar (Modo Desarrollador)

Sigue estos pasos para tener el proyecto funcionando en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado:

* **Node.js** (versión 18 o superior)
* **MongoDB** (versión 6 o superior)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone (https://github.com/santiagourdaneta/Plataforma-de-Intercambio-de-Libros/)
    cd Plataforma-de-Intercambio-de-Libros
    ```

2.  **Instala las dependencias del backend:**
    ```bash
    npm install
    ```

3.  **Configura tus variables de entorno:**
    Crea un archivo `.env` en la raíz de tu proyecto con el siguiente contenido (puedes ajustar el puerto y la URI de MongoDB según tu configuración):
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/librosVecinosDB
    # Para entornos de prueba:
    MONGO_URI_TEST=mongodb://localhost:27017/librosVecinosTestDB
    ```

4.  **Inicia el servidor backend:**
    ```bash
    npm start # Asegúrate de haber configurado tu script "start" en package.json para ejecutar index.js
    ```
    Si no tienes un script `start`, puedes ejecutarlo directamente:
    ```bash
    node index.js
    ```
    El servidor estará escuchando en `http://localhost:3000` (o el puerto que hayas configurado).

### 🧪 Ejecutar Pruebas (Backend)

He implementado pruebas unitarias para asegurar la robustez de la API.

1.  Asegúrate de que no haya una instancia de MongoDB ya corriendo en tu sistema o que tu `MONGO_URI_TEST` apunte a una base de datos de prueba exclusiva.
2.  Ejecuta las pruebas de backend con Jest:
    ```bash
    npm run test:backend
    ```
    Esto conectará a la base de datos de prueba, iniciará un servidor de prueba, ejecutará los tests y limpiará los recursos al finalizar.

## ⚙️ Estructura del Proyecto

.
├── .github/                 # Configuraciones de GitHub (incluye Workflows de CI/CD)
│   └── workflows/
│       └── test_backend.yml # Flujo de trabajo para pruebas automatizadas
├── backend/                 # Lógica del lado del servidor (Node.js, Express, MongoDB)
│   ├── server.js            # Definición de la aplicación Express y rutas
│   └── (otros archivos)     # Modelos de Mongoose, controladores, etc.
├── tests/
│   └── backend/
│       └── server.test.js   # Pruebas para los endpoints del backend
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore               # Archivos y carpetas a ignorar por Git
├── index.js                 # Punto de entrada principal para iniciar el servidor
├── package.json             # Dependencias y scripts del proyecto
└── README.md                # Este archivo

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar Libros Vecinos, por favor:

1.  Haz un "fork" del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y haz "commit" (`git commit -m 'feat: Añade nueva funcionalidad X'`).
4.  Sube tus cambios a tu "fork" (`git push origin feature/nueva-funcionalidad`).
5.  Abre un "Pull Request" explicando tus cambios.

## 📞 Contacto

¿Tienes preguntas o sugerencias? Puedes abrir un "issue" en este repositorio.

---
