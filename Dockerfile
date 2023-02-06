FROM node:alpine as builder
WORKDIR /build

# Install NPM packages first so docker can cache this layer.
COPY package*.json ./
RUN npm install

# Then copy over everything else and build the application.
COPY . .
RUN npm run build

FROM nginx:alpine as production
WORKDIR /app

# Copy over our nginx configuration and then the app build.
COPY ./infrastructure/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /app

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
