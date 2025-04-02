# Use an official Node image with a specific version
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install dependencies with a specific npm version
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .



# Expose the port Vite uses
EXPOSE 5173

# Command to run the development server with host option to make it accessible
ENTRYPOINT  ["bun", "run", "dev"]