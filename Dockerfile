FROM node:8-alpine AS build

RUN mkdir -p /opt/cboard/build
WORKDIR /opt/cboard

COPY . .

RUN npm install && npm run build

##############################

FROM nginx:stable-alpine 

COPY ./rootfs/ /
COPY --from=build /opt/cboard/build ./usr/share/nginx/html