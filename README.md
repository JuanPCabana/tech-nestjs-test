
## Descripción

Api desarrollada para prueba técnica, la presente api cuenta con:

- Login (Estrategia local y OAuth con google)
- Registro (Con la contraseña encriptada)
- Olvido de contraseña con envío de email.
- Subida de archivos (AWS S3)
- Bajada de archivos (AWS S3)
- Gestor de archivos donde puedes: cambiar nombre y obtener enlace de
archivo, esta conformado por 3 endpoints (listado de archivos, renombrado de archivos y obtencion de enlace). (AWS S3)
- Buscador de imagenes online integrado usando una API externa
(Unsplash)
- Subida de una imagen proveniente de una API externa directo a S3 (Es
decir, sin que el usuario tenga que bajar la imagen en su local y luego
subirla manualmente) solo enviando la url de la imagen a subir.

## Especificaciones
Cuenta con las siguientes tecnologias:
 - Api desarrollada en Node.Js(v18.16.0) y NestJs (v10.0.2).
 - Base de datos: MongoDB.
 - Almacenamiento de archivos en un bucket S3 de AWS
 - Un servicio de OAuth mediante Token.
 - Documentación de servicios con SWAGER.
 - Compilado en una imagen de docker.
 - Pruebas unitarias basicas (Jest)


## Installation

Para realizar la instalacion del proyecto es necesario clonar el repositorio o descargar la imagen de docker.

```bash
$ git clone https://github.com/JuanPCabana/tech-nestjs-test.git
```
ó
```bash
$ sudo docker pull scuanchi/tech-test-api
```

## Lanzar instancia con docker
```bash
$ sudo docker run -p 3000:3000 --env-file <ruta-del-archivo-.env>  tech-test-api 
```
Las variables de entorno necesarias para el proyecto son las siguientes
```bash
#MongoDb
DATABASE_URI=value

#SMTP Gmail
SMTP_HOST=value
SMTP_USER=value
SMTP_PASSWORD=value

#JWT Key
JWT_SECRET_KEY=value

#OAuth
CLIENT_ID=value
CLIENT_SECRET=value

#AWS Credentials
BUCKET_NAME=value
AWS_REGION=value
AWS_ACCESS_KEY_ID=value
AWS_SECRET_ACCESS_KEY=value

#Upload Rate Throttler
UPLOAD_RATE_TTL=value
UPLOAD_RATE_LIMIT=value

#Unsplash key
UNSPLASH_ACCESS_KEY=value 
```
## Lanzar instancia con Node.Js
Ingresas desde la terminal a la carpeta del proyecto. Si estás usando Node version manager (nvm) recuerda usar:
```bash
$ nvm use 
```
Procede a instalar las dependencias del proyecto usando el comando:
```bash
$ npm install
```
Luego de instalar las dependencias lanza la instancia en local usando
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
ó
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
## Documentacion
Una vez lanzado el proyecto puedes visualizar la documentación de swagger en 
```bash
http://localhost:3000/docs
```

## Test
Para correr las pruebas simples puedes usar

```bash
# unit tests
$ npm run test
```

