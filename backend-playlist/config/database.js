const { MongoClient } = require('mongodb')
require('dotenv').config()

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error('A variável de ambiente MONGODB_URI não está definida')
}

const client = new MongoClient(uri)
let db;

async function connectToDatabase() {
    try {
        await client.connect()
        console.log('✅ Conectado com sucesso ao MongoDB via Docker!');
        db = client.db();

    } catch (e) {

        console.error('❌ Falha ao conectar com o MongoDB', e);
        process.exit(1);

    }
}

function getDB() {

    if (!db) {
        throw new Error('Banco de dados não inicializado. Chame connectToDatabase primeiro.');
    }

    return db;
}

module.exports = {
    connectToDatabase,
    getDB
}
