# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first so this layer is cached unless package files change
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Replace default nginx config with our SPA-aware one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
