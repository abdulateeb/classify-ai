# --- Build Stage ---
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile || npm install

COPY . .
RUN npm run build

# --- Serve Stage ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
