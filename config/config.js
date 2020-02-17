import fs from 'fs';

export default {
    local: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        dialect: 'postgres'
    }
};