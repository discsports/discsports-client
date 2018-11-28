# build stage
FROM node:10 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#production stage
FROM fholzer/nginx-brotli as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
COPY ssl-params.conf /etc/nginx/snippets/ssl-params.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]