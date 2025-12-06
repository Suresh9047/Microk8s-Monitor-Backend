# Quick start (local):

1. create a db named 'boiler_plate_express_rest' (delete and recreate)
   with Charset as 'utf8mb4' and Collation as 'utf8mb4_general_ci'
2. Copy `.env.example` to `.env` and edit DB credentials if needed.
3. npm install
4. In root/.sequelize.rc file, modify the paths of src/config.js, migrations(dir), seeders(dir), if needed
5. npx sequelize-cli db:migrate --config src/config/config.js OR npm run db:migrate
6. npx sequelize-cli db:seed:all --config src/config/config.js OR npm run db:seed
7. npm run dev

# Boiler plate: React with Nodejs Express Api

client:
https://gitlab.arffy.com/arffy-boiler-plate/boiler_plate_vite_react
Server:
https://gitlab.arffy.com/arffy-boiler-plate/boiler_plate_express_rest

Login / Logout with server side session.
For admin view all active logins, for a particular user view all login history.

Samples - full CRUD operations.

===
Login authentication, jwt token implementation is there.
Server side Sequelize ORM is used
