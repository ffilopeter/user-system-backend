import {Sequelize, DataTypes} from "sequelize";
import db from "../config/Database.js";
import Role from "./RoleModel.js";

const User = db.define('users', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    gender: {
        type: DataTypes.STRING(6),
        defaultValue: 'NA'
    },

    department: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },

    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default User;