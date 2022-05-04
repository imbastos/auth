// db.js

const db = require("mysql2/promise");

async function connect() {

    if (global.connection && global.connection.state !== "disconnected") return global.connection;

    const connection = await db.createConnection(process.env.CONNECTION_SECRET);
    global.connection = connection;
    console.log(`MySQL -> Conectado com sucesso!`)
    return connection;

};

async function _select(params) {

    const connection = await connect();
    const [arr] = await connection.query(`SELECT ${params};`);
    return arr;

}

async function _create(params) {

    const connection = await connect();
    const arr = await connection.query(`INSERT ${params};`);
    return await arr;

}

async function _update(params) {

    const connection = await connect();
    const [arr] = await connection.query(`UPDATE ${params};`);
    return arr;

}

async function _delete(params) {

    const connection = await connect();
    const [arr] = await connection.query(`DELETE ${params};`);
    return arr;

}

async function _exists(params) {

    const connection = await connect();
    const [arr] = await connection.query(`SELECT EXISTS(SELECT 1 ${params});`);
    const exists = arr.find(state => state);

    return exists[Object.keys(exists)[0]] === 1;

}

module.exports = { connect, _select, _create, _update, _delete, _exists }
