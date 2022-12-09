import db from "../config/Database.js";
import User from "./UserModel.js";
import Role from "./RoleModel.js";

// Role.belongsToMany(User, {
//     through: 'user_roles',
//     foreignKey: 'role_id',
//     otherKey: 'user_uuid'
// });

// User.belongsToMany(Role, {
//     through: 'user_roles',
//     foreignKey: 'user_uuid',
//     otherKey: 'role_id'
// });

const UserRole = db.define('user_roles', {});

Role.belongsToMany(User, {
    through: UserRole
    // as: 'users',
    // foreignKey: 'role_id'
});

User.belongsToMany(Role, {
    through: UserRole
    // as: 'roles',
    // foreignKey: 'user_id'
});

await User.sync();
await Role.sync();
await UserRole.sync();

export {User, Role, UserRole};