# 📌 Mini CRM (Fullstack con React, Node.js, Express y MySQL)

Aplicación **Fullstack** sencilla tipo CRM que permite:  
- Registrar/Login de usuarios con JWT  
- Crear/Editar/Eliminar proyectos  
- En cada proyecto gestionar tareas (crear, completar/reabrir, eliminar)  
- Todo protegido por autenticación  

---

## 🌐 Enlace en Producción

🔗 [https://mini-crm-1-x5jd.onrender.com/](https://mini-crm-1-x5jd.onrender.com/)

---

### 🚀 Despliegue

- **Backend** desplegado en [Render](https://render.com/)
- **Frontend** desplegado en [Render](https://render.com/)
- **Base de datos MySQL** en la nube proporcionada por [Filess.io](https://filess.io/)

---

## 🚀 Tecnologías usadas
### Backend (server/)
- Node.js + Express  
- Sequelize (MySQL)  
- JWT + bcryptjs  
- dotenv  

### Frontend (client/)
- React + Vite  
- React Router DOM  
- Tailwind CSS v4  
- Fetch API  

### Extras
- Postman (colección incluida) 

---

## ⚙️ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/mini-crm.git
cd mini-crm
```

### 2. Configurar el Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

El server correrá en 👉 **http://localhost:4000**

### 3. Configurar el Frontend
```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

El client correrá en 👉 **http://localhost:5173**

---

## 🔑 Variables de entorno

### Server (.env)
```
DB_NAME=mini_crm
DB_USER=root
DB_PASS=tu_password
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=clave_supersecreta
```

### Client (.env)
```
VITE_API_URL=http://localhost:4000
```

---

## 🛠️ API Endpoints

### Auth
- `POST /auth/register` → {name, email, password}  
- `POST /auth/login` → devuelve {token}  
- `GET /auth/me` → datos usuario logueado  

### Projects
- `GET /projects`  
- `POST /projects` → {name}  
- `PUT /projects/:id`  
- `DELETE /projects/:id`  

### Tasks
- `GET /projects/:id/tasks`  
- `POST /projects/:id/tasks` → {title}  
- `PATCH /tasks/:id/toggle` (completar/reabrir)  
- `DELETE /tasks/:id`  

---

## 📬 Postman
En la raíz del proyecto tienes la colección:  
**`Mini CRM.postman_collection.json`**  
→ Importar en Postman y probar todas las rutas con JWT.  

---

## ✅ Flujo básico
1. Registrarse en `/register`  
2. Loguearse en `/login` → copia token  
3. Con ese token ya puedes crear proyectos y dentro de ellos gestionar tareas.  

---
