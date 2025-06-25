# Build stage
FROM node:18 AS builder
WORKDIR /app

ARG REACT_APP_BACKEND_URL
ARG REACT_APP_BACKEND_PORT
ARG REACT_APP_SALT_HASH
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_PORT=$REACT_APP_BACKEND_PORT
ENV REACT_APP_SALT_HASH=$REACT_APP_SALT_HASH

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Deployment stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]