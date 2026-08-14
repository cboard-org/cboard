# Stage 1 - the build process
FROM node:22.23.2 AS build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json .npmrc ./
RUN HUSKY=0 npm ci
COPY . ./
RUN NODE_OPTIONS="--max-old-space-size=4192" npm run build

# Stage 2 - the production environment
FROM nginx:stable-alpine
COPY ./rootfs/ /
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
