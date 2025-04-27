# 🔵 Stage 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# 🟢 Stage 2: Runtime otimizado
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["node", "dist/main"]
