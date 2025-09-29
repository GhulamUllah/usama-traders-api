// src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

interface Config {
  app: {
    env: string;
    port: number;
  };
  db: {
    url: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  security: {
    saltRounds: number;
  };
}

export const config: Config = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
  },
  db: {
    url: process.env.DATABASE_URL || "mongodb://localhost:27017/myapp",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refreshsecret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  security: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  },
};
