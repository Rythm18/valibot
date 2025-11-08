FROM public.ecr.aws/x8v8d7g8/mars-base:latest
WORKDIR /app

# Copy all source files  
COPY . .

# Install dependencies at workspace root
RUN pnpm install

CMD ["/bin/bash"]
