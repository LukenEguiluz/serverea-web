# client/Dockerfile
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final para exponer los archivos compilados (vite/dist o react/build)
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
