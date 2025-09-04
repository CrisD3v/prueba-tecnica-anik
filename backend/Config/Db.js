import { Sequelize } from "sequelize";
import { env } from "./env.js";

export const sequelize = new Sequelize(
  env.DB.DATABASE,
  env.DB.USER,
  env.DB.PASS,
  {
    host: env.DB.HOST,
    dialect: env.DB.DIALECT,
    logging: env.DB.LOGGING,
  }
);
