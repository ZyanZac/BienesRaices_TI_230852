import dotenv from 'dotenv'
dotenv.config()

module.exports = {
    development: {
    username: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_NAME,
    host: process.env.BD_HOST,
    dialect: 'mysql'
  },
  test: {
    username: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_NAME,
    host: process.env.BD_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_NAME,
    host: process.env.BD_HOST,
    dialect: 'mysql'
  }
}