FROM node:20-slim

# Install ffmpeg for Cloudinary video compression
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the shared packages and the API
RUN pnpm --filter @ally-ability/api... build

# Expose port and start
EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production

# Start script
CMD ["pnpm", "--filter", "@ally-ability/api", "start"]
