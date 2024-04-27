import dotenv from 'dotenv';

dotenv.config();

interface Config {
  MONGO_URI: string;
}

const config: Config = {
  MONGO_URI: process.env['MONGO_URI'] || '',
};

export default config;