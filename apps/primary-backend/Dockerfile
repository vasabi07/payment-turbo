# Stage 1: Build the application
FROM node:18-bullseye-slim AS builder

# Set the working directory
WORKDIR /app

# Copy the root-level package.json and yarn.lock for monorepo dependencies
COPY package.json yarn.lock ./

# Install root dependencies
RUN yarn install --frozen-lockfile

# Copy the entire monorepo
COPY . .

# Install packages and generate Prisma client in the build stage
RUN cd packages/db && yarn install && yarn prisma generate

# Build the primary-backend with its dependencies
RUN npx turbo run build --filter=primary-backend...

# Stage 2: Create a smaller image with just the production build
FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /app

# Copy the built application and its dependencies from the builder stage
COPY --from=builder /app/apps/primary-backend/dist ./dist
COPY --from=builder /app/apps/primary-backend/package.json ./

# Also copy the db module to ensure it's available
COPY --from=builder /app/packages/db ./packages/db

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Ensure that the Prisma client is already generated
# This step is not necessary if already generated in the build stage, 
# so you can comment it out or remove it.
# RUN cd packages/db && yarn prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
