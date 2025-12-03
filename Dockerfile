# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies

# Copy the rest of the application code
COPY . .
RUN npm install
RUN npx run build

# Set a default port (can be overridden when running the container)
ENV PORT=31666
ENV NODE_ENV=production
ENV HOST=localhost

# Expose the port the app runs on
EXPOSE 31666

# Command to run the application
CMD ["npm", "run", "dev"]
