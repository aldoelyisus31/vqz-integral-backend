import * as Joi from "joi";

export type AppEnv = 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';

export const APP_CONFIG = () => ({
  node_env: process.env.NODE_ENV,
  app: {
    name: process.env.APP_NAME,
    port: +process.env.APP_PORT,
  },
  db: {
    host    : process.env.DB_HOST,
    port    : +process.env.DB_PORT,
    user    : process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name    : process.env.DB_NAME,
  },
  bcrypt:{
    saltRounds: +process.env.BCRYPT_SALT_ROUNDS,
  },
  jwt: {
    secret   : process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});

/**
 * Joi validation schema for application configuration environment variables.
 *
 * This schema validates and provides default values for the following configuration options:
 * - `NODE_ENV`: The environment in which the app is running (default: 'DEVELOPMENT').
 * - `APP_NAME`: The name of the application (default: 'NestJS API').
 * - `APP_PORT`: The port on which the application will run (default: 3000).
 * - `DB_HOST`: The database host (required).
 * - `DB_PORT`: The database port (default: 5432).
 * - `DB_USERNAME`: The database username (required).
 * - `DB_PASSWORD`: The database password (required).
 * - `DB_NAME`: The database name (required).
 * - `BCRYPT_SALT_ROUNDS`: The number of salt rounds for bcrypt hashing (default: 10).
 * - `JWT_SECRET`: The secret key used for JWT signing (required).
 * - `JWT_EXPIRES_IN`: The expiration time for JWT tokens (required).
 */
export const APP_CONFIG_SCHEMA = Joi.object({
  NODE_ENV: Joi.string().default('DEVELOPMENT'),

  // App Config ----------------------------------------------------
  APP_NAME: Joi.string().min(1).default('NestJS API'),
  APP_PORT: Joi.number().default(3000),
  // DB Config -----------------------------------------------------
  DB_HOST    : Joi.string().min(1).required(),
  DB_PORT    : Joi.number().default(5432),
  DB_USERNAME: Joi.string().min(1).required(),
  DB_PASSWORD: Joi.string().min(1).required(),
  DB_NAME    : Joi.string().min(1).required(),
  // Bcrypt Config -------------------------------------------------
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  // JWT Config ----------------------------------------------------
  JWT_SECRET    : Joi.string().min(1).required(),
  JWT_EXPIRES_IN: Joi.string().min(1).required(),
})

