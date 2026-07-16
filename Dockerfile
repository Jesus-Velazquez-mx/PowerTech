# Construir el Frontend (Vue)
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Construir el Backend (Express)
FROM node:20-alpine

# Instalamos curl para poder descargar el certificado de AWS
RUN apk add --no-cache curl

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

# Creamos la carpeta config y descargamos el certificado de AWS RDS directo en la imagen
RUN mkdir -p config && \
    curl -o ./config/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

COPY backend/ ./

# Traemos la carpeta "dist" de Vue a la carpeta "public"
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000

CMD ["npm", "start"]