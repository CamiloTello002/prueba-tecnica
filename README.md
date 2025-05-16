# Prueba técnica: gestión de inventario por empresa
Este proyecto se hizo con React, NestJS y PostgreSQL

## Requisitos
- Docker

## Pasos para correr proyecto:
1. Clonar el repositorio
```
git clone https://github.com/CamiloTello002/prueba-tecnica.git --depth=1
```

2. Crear archivo ```.env``` a partir de la plantilla ```.env.template```. Recuerda que tú mismo tendrás que proveer credenciales para el servidor SMTP y la API key de Gemini

3. Levantar frontend, backend y base de datos con Docker Compose
```
docker-compose up -d
```

Si estás usando Docker en Linux, puede que necesites permisos root:
```
sudo docker-compose up -d
```
O puede que necesites correr ```docker compose``` en vez de ```docker-compose```
```
sudo docker compose up -d
```

4. Clonar base de datos:
``` 
docker exec -it prueba-tecnica-backend node /app/dist/cli.js seed
```

5. Abrir aplicación en ```localhost:8000``` en el navegador. Si cambiaste el valor de ```FRONTEND_PORT```, entonces abre la aplicación en ``` localhost:FRONTEND_PORT```, donde FRONTEND_PORT es justamente el valor que pusiste

## Usuarios de prueba:
### Administrador
**correo:** admin@example.com
**contraseña:** adminuser

### Usuario externo
**correo:** extern@example.com
**contraseña:** externuser
