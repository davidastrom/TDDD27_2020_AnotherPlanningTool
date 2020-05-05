FROM node:lts as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
EXPOSE 8080
CMD ["npm","start"]