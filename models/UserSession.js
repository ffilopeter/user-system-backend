import {Sequelize, DataTypes} from "sequelize";
import db from "../config/Database.js";

const UserSession = db.define('user_sessions', {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ipaddr: {
        type: DataTypes.STRING(15),
        allowNull: true
    },

    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false
    },

    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default UserSession;