# Stage 1: Build the application
# Use the stable Node.js 20 LTS (Long-Term Support) version for reliability.
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package files first to leverage Docker's build cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build -- --configuration production

# Stage 2: Serve the application with NGINX
# Use a lightweight alpine-based NGINX image for a small final container.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove the default NGINX welcome page
RUN rm -rf ./*

# Copy the compiled application files from the 'build' stage.
COPY --from=build /usr/src/app/dist/ums-client/browser/ .

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow traffic to the web server
EXPOSE 80