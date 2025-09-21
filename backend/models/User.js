// backend/models/User.js
class User {
  constructor(id, username, password, roleId) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.roleId = roleId;
  }
}

module.exports = User;
