FROM public.ecr.aws/x8v8d7g8/mars-base:latest
WORKDIR /app

# Copy repository files
COPY . .

# Install workspace dependencies at root (required for pnpm workspace)
RUN pnpm install

# Default to interactive shell (tests run from /app root via test.sh)
CMD ["/bin/bash"]
