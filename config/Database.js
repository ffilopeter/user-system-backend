import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.ENV_MAIN_DB, process.env.ENV_DB_USER, process.env.ENV_DB_PASS, {
    host: process.env.ENV_DB_HOST,
    dialect: 'mysql'
});

export default db;