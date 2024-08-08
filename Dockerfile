# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx tailwindcss build

# Set a default port (can be overridden when running the container)
ENV PORT=31666
ENV NODE_ENV=production
ENV HOST=169.254.123.199

# Expose the port the app runs on
EXPOSE 31666

# Command to run the application
CMD ["sh", "-c", "npm run dev --port $PORT"]
