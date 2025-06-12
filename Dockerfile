FROM node:22.16-alpine3.22 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
CMD [ "npm","start:dev" ]

FROM node:22.16-alpine3.22 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --frozen-lockfile


FROM node:22.16-alpine3.22 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN npm test
RUN npm build

FROM node:22.16-alpine3.22 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN npm install --prod --frozen-lockfile


FROM node:22.16-alpine3.22 as prod
EXPOSE 3000
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js"]