import { MongoClient, GridFSBucket } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017")
const database = client.db('db')

export const bucket = new GridFSBucket(database);
export const users = database.collection('users')
export const tasks = database.collection('tasks')
