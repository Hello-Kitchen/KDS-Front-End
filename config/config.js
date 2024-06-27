require('dotenv').config();
const url = process.env.BACKEND_URL
const port = process.env.BACKEND_PORT

module.exports = {
    url: url,
    port: port,
}