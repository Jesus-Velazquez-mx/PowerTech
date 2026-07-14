# Construir el Frontend (Vue)
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiamos dependencias y las instalamos
COPY frontend/package*.json ./
RUN npm install

# Copiamos el código fuente de Vue y compilamos
COPY frontend/ ./
RUN npm run build

# Construir el Backend (Express) y unir todo
FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias del backend (usamos --omit=dev para una imagen más ligera)
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copiamos el código fuente del backend
COPY backend/ ./

# Copiamos el frontend ya compilado desde la Etapa 1
# directamente a la carpeta "public" de Express
COPY --from=frontend-builder /app/frontend/dist ./public

# Exponemos el puerto de Express
EXPOSE 3000

# Iniciamos el servidor
CMD ["npm", "start"]