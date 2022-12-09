import {Sequelize, DataTypes} from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const Role = db.define('roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Role;