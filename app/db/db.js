import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// will export my database as db!
export const db = mysql2.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_DATABASE,
port: process.env.DB_DATABASE
})