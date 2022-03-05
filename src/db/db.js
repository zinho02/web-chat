async function connect() {
    if (global.connection)
        return global.connection.connect();
 
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: 'postgres://postgres:123456@localhost:5432/web-chat'
    });
 
    global.connection = pool;
    return pool.connect();
}

async function selectUsers() {
    const client = await connect();
    const res = await client.query('SELECT * FROM usuarios');
    return res.rows;
}

module.exports = { selectUsers, createUser }

async function createUser(user) {
    const client = await connect();
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)';
    const crypto = require('crypto');
    const passwordHash = crypto.createHash('sha256').update(user.senha).digest('hex');
    const values = [user.nome, user.email, passwordHash];
    return await client.query(sql, values);
}