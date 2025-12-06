const jwt = require("jsonwebtoken");
const repository = require("../repositories/auth.repository");
const usersService = require("../services/users.service");
const db = require("../models"); //using sequelize orm models.
const Util = require("../utils/utils");
const AppError = require("../responses/apperror");

class Service {

  //All Service's methods.. will return direct(whatever we need) data or {error: <message>}
  // async getAll() {
  //   return await repository.getAll();
  // }

  // async getById(id) {
  //   return await repository.getById(id);
  // }

  async register(data, roleName = "User") {
    const existing = await repository.getByUsername(data.username);
    if (existing) {
      return { error: "User already exists." };
    }
    const newUser = await repository.create(data);
    // Assign Role
    if (newUser && !newUser.error) {
      // Find Role
      const role = await db.Role.findOne({ where: { name: roleName } });
      if (role) {
        await db.UserRole.create({
          user_id: newUser.id,
          role_id: role.id,
          created_by: newUser.id, // self-created
        });
      } else {
        console.log(`Role ${roleName} not found. User created without role.`);
      }
    }
    return newUser;
  }

  async login(reqData) {
    if (!reqData || !reqData.username || !reqData.password) {
      return { error: "Enter valid credentials" };
    }
    //maybe validation logic codes comes here.
    const data = await repository.login(reqData);

    if (data.error) {
      return data;
    }
    const user = data;
    // JWT token
    const userPayload = { id: user.id, username: user.username };
    const token = await Util.generateToken(userPayload);
    const lh = await repository.checkAndUpdateExistingSession(user, token);
    if (lh.error) {
      return lh;
    }
    // if lh.message available means. // sessionData already there and updated now.
    if (!lh.message) {
      // create a server session in login_history table starts
      const sessionData = {
        user_id: user.id,
        token: token.accessToken,
        refresh_token: token.refreshToken,
        login_time: Util.getToDayUtc(),
        created_by: user.id,
      };
      console.log("session data: ", sessionData);
      const session = await usersService.createLoginHistory(sessionData);
      if (session.error) {
        return session;
      }
      // create a server session in login_history table ends
    }

    // Roles & permissions
    const { roles, permissions } =
      await this.getUserRolesAndPermissionsSequelize(user.id);
    user.roles = roles;
    user.permissions = permissions;
    return { user, token }; // Standardized data
  }

  async getUserRolesAndPermissionsSequelize(id) {
    const user = await repository.getUser(id);
    if (!user) {
      return { error: "User not found" };
    }
    // Extract roles and permissions
    const roles = user.roles.map((role) => role.name); // Assuming 'name' field for role
    const allPermissions = user.roles.flatMap(
      (role) =>
        role.permissions
          ? role.permissions.map((permission) => permission.name)
          : [] // Assuming 'name' field for permission
    );
    // Remove duplicates by creating a Set and converting it back to an array
    // const uniquePermissions = [...new Set(permissions)];
    //OR
    // Use reduce to create an array with unique permissions
    const permissions = allPermissions.reduce((unique, item) => {
      return unique.includes(item) ? unique : [...unique, item];
    }, []);
    return { roles, permissions };
  }
  // Add more business logic methods
}

module.exports = new Service();
