# Guttmann Demo

Cliente en NextJS y servidor en Express, ambos con TypeScript, incluye el juego de WCST.

### Requisitos
Para poder utilizar esta aplicación, es necesario tener instalado NodeJS y npm.

### Instalación
#### 1. Clonar el repositorio 
```bash 
git clone https://github.com/usuario/nombre-proyecto.git
```
#### 2. Instalar dependencias de la carpeta client
```bash
cd client

npm install
```
#### 3. Instalar dependencias de la carpeta server
```bash
cd ../server

npm install
```
#### 4. Crear un archivo .env en la carpeta raíz de server con las siguientes variables de entorno:
```makefile
MONGOPWD = "Contraseña de la base de datos"
SERVERPORT= 8080 (o cualquier puerto libre)
```
#### 5. Iniciar la aplicación

Hay una lista de comandos que se ejecutan con ```npm run <nombre del comando>``` en el fichero package.json de client y server, pero la mejor manera es la siguiente, ya que permite recargar ambas aplicaciones sin reiniciarlas:

```bash
npm run dev
```
#  
#### Acceso al juego

Para acceder al juego se puede abrir el cliente como se indica arriba, e introducir la ruta `/games/wordgame`, o bien hacer click en "Ir al juego" en cualquiera de las diferentes ventanas.

![Captura del juego](/ss.png)
#

### Licencia
Este proyecto está bajo la Licencia MIT.
Revisar el fichero LICENSE.