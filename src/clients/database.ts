import * as mongoDB from "mongodb";

export async function connectToDatabase () : Promise<mongoDB.Db>{
    if (typeof process.env.DB_CONN_STRING === 'undefined') {
        throw new Error('DB_CONN_STRING is not defined');
    }
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    if (typeof process.env.DB_NAME === 'undefined') {
        throw new Error('DB_NAME is not defined');
    }
    const db: mongoDB.Db = client.db(process.env.DB_NAME);   
    console.log(`Successfully connected to database: ${db.databaseName}`);
    return db;
 }
