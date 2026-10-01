# --- STAGE 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL required by Prisma engine
RUN apk add --no-cache openssl

# Prevent Prisma from downloading engines during npm install/ci
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build


# --- STAGE 2: Runner Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

# Install OpenSSL and PostgreSQL client tools for backups
RUN apk add --no-cache openssl postgresql-client

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src   

EXPOSE 4000

CMD ["node", "dist/app.js"]