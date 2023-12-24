FROM node:14.16.1 as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx:1.21.3
COPY --from=builder /app/web /usr/share/nginx/html/console
#COPY web /usr/share/nginx/html/console
WORKDIR /usr/share/nginx/html/console

#docker build -t chudaozhe/ent:admin1.0-release .