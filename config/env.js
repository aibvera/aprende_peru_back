import dotenv from "dotenv";
dotenv.config();

// App
export const INDEX_URL = process.env.INDEX_URL;
export const APP_PORT = process.env.APP_PORT;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [];
export const DEBUG = process.env.DEBUG === "true";

// BD
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES = process.env.JWT_EXPIRES;
export const JWT_REFRESH = process.env.JWT_REFRESH;
export const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES;

// Bcrypt
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
