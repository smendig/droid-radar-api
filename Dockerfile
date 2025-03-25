FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.build.json ./


RUN npm run build


FROM node:22 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./

RUN npm install --only=production

CMD ["npm", "run", "start"]