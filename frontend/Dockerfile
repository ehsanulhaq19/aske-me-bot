# ----------- Stage 1: Builder -----------
FROM node:18 AS builder

WORKDIR /app

# Set build-time environment variable
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# Use npm install if no package-lock.json
RUN npm install

COPY . .

# Run build only for production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# ----------- Stage 2: Runtime -----------
FROM node:18 AS runner

WORKDIR /app

# Same ENV and ARG
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Copy built app and node_modules
COPY --from=builder /app /app

# Add /node_modules/.bin to PATH so "next" is available
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 3000

# Run app based on mode
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run start; else npm run dev; fi"]
