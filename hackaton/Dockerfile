# Imagen base de Nginx
FROM nginx:alpine

# Copiamos todos los archivos del microservicio (HTML, JS, CSS, imágenes, etc.)
COPY . /usr/share/nginx/html

# Exponemos el puerto donde nginx servirá tu frontend
EXPOSE 8089

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
