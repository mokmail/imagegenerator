FROM node:18

# Create app directory
WORKDIR /app
COPY . .

# Install app dependencies
RUN npm install

# Expose the app port
EXPOSE 3000

# Start the React app
CMD [ "npm", "start" ]
