// src/config/index.ts
import dotenv from 'dotenv';

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
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT),
  },
  db: {
    url: process.env.MONGO_URI as string,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
  security: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
  },
};
