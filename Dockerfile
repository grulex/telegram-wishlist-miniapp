FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=20000000
ENV ADDRESS_HEADER=True-Client-IP
CMD [ "node", "build"]