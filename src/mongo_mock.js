const mongo = require('mongo-mock');
const { MongoClient } = mongo;
MongoClient.persist = "mongo.js";

class MyMongoClient {
    constructor(mongoURL) {
        this.mongoURL = mongoURL;
    }

    async connect(mongoURL) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongoURL, {}, function (err, client) {
                const db = client.db();

                if (db) resolve(db);
                else reject(new Error('MongoDB Not Connected'));
            });
        });
    }

    async insert({ client, collectionName, docs }) {
        return new Promise((resolve, reject) => {
            const collec = client.collection(collectionName);

            collec.insertMany(docs, function (err, result) {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    async get({ client, collectionName, query }) {
        return new Promise((resolve, reject) => {
            const collec = client.collection(collectionName);

            if (query !== undefined) {
                if (typeof query !== 'object') {
                    throw new Error('Expected query to be an object. Found ' + typeof query);
                } else if (!Object.keys(query).length) {
                    throw new Error('Expected query to be a non-empty object. Found an empty query object');
                } else {
                    collec.find(query).toArray((err, docs) => {
                        if (err) reject(err);
                        else resolve(docs);
                    });
                }
            }

            collec.find({}).toArray((err, docs) => {
                if (err) reject(err);
                else resolve(docs);
            });
        });
    }
}

module.exports = new MyMongoClient();
