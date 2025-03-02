<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio.
2. Acceder al directorio y jecutar:

```bash
npm install
```

3. Tener nest CLI instalado.

```bash
npm i -g @nestjs/cli
```

4. Levantar la base de datos.

```bash
docker-compose up -d
```

5. Clonar `.env.template` y renombrar a `.env`.

6. Rellenar las variables de entorno en el archivo `.env`. Para desarrollo puedes dejar las variables con los valores del template. Pero no olvides cambiarlas en producción.

7. Lanzar la aplicación en desarrollo.

```bash
npm run start:dev
```

## Stack

- Backend Framework: Nestjs
- Database: Postgres
- Autenticación: Pasport (JWT Strategy)
- Logger: Winston (local con rotación de logs)
