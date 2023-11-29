const host = process.env.DB_HOST || "localhost";

const user = process.env.DB_USER || "root";

const password = process.env.DB_PASS || "";

const database = process.env.DB_DATABASE || "caro";

module.exports = { host, user, password, database };
