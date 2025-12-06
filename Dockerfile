FROM node:24.7.0-slim

# Install dependencies needed for networking/debugging
RUN apt-get update && apt-get install -y netcat-openbsd net-tools && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
# Use the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
# This becomes the default command if no args are passed to the entrypoint
CMD ["node", "app.js"]
# CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node app.js"]