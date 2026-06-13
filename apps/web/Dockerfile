ARG API_URL=http://api:4000

FROM node:22-alpine AS builder
ARG API_URL
ENV API_URL=$API_URL
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/ apps/web/
RUN npm ci
WORKDIR /app/apps/web
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app/apps/web
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./
COPY --from=builder /app/apps/web/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
