const db = require("../models"); // Adjust path based on your project structure
const Model = db.User; // Access the model
const { Op } = require("sequelize");
const LoginHistoryModel = db.LoginHistory; // Access the model
const Util = require("../utils/utils");

const singlurName = "user";
const pluralName = "users";
class Repository {
  //All Repository's methods.. will return direct(whatever we need) data or {error: <message>}
  async create(data) {
    //beforeCreate hook will be fired defined in User Model file.
    //for hashing the password data.password was modified in hook in the model class.
    return await Model.create(data);
  }
  async login(data) {
    const { username, password } = data;

    const user = await Model.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: username }],
      },
    });
    if (!user) return { error: "User not found" };

    const passwordMatch = await Util.comparePassword(password, user.password);
    if (!passwordMatch) return { error: "Invalid password" }; // invalid credentials

    return { id: user.id, username: user.username };
  }
  checkAndUpdateExistingSession = async (user, token) => {
    const lh = await LoginHistoryModel.findOne({
      where: {
        user_id: user.id,
        logout_time: null,
      },
    });
    if (!lh) {
      console.log("No active session...");
      return {}; // no current session .. No Error
    }
    //update the existing session with new tokens
    const updateData = {
      token: token.accessToken,
      refreshToken: token.refreshToken,
    };
    const [updatedRows] = await LoginHistoryModel.update(updateData, {
      where: { user_id: user.id, logout_time: null },
    });
    if (!updatedRows) {
      console.log("active session update failed..");
      //unable to update existing session , something wrong. Error.
      return { error: `Session update failed` };
    }
    console.log("active session updated..");
    return { message: "updated" }; //updated the existing session . everything ok. No Error.
  };
  async getUser(id) {
    const data = await Model.findByPk(id, {
      // subQuery: false, // Add this option - NO USE
      include: [
        {
          model: db.Role, // Include the Role model
          as: "roles", // Alias if defined in association
          through: { attributes: [] }, // Exclude join table attributes if not needed
          include: [
            {
              model: db.Permission, // Include the Permission model nested within Role
              as: "permissions", // Alias if defined in association
              through: { attributes: [] }, // Exclude join table attributes if not needed
            },
          ],
        },
      ],
    });
    if (!data) return { error: "User not found" };
    return data;
  }
  async getByUsername(username) {
    return await Model.findOne({ where: { username: username }, raw: true });
  }
}
module.exports = new Repository();
