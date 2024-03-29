FROM node:20.9.0-alpine AS build
RUN apk add g++ make py3-pip
WORKDIR /fyp_frontend_app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /fyp_frontend_app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]