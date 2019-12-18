const { assert, expect, should, use } = require('chai');
const mocha = require('mocha');

use(require('chai-as-promised'));

const mongoClient = require('../src/mongo_mock');

const mongoURL = 'http://localhost:27017/test-mongo-mock';

describe('validation tests', () => {
    it('should throw exception when query is string', async () => {
        const client = await mongoClient.connect(mongoURL);

        await expect(mongoClient.get({ client, collectionName: 'logs', query: '' })).to.be.rejected;
    });

    it('should throw exception when query is an empty object', async () => {
        const client = await mongoClient.connect(mongoURL);

        await expect(mongoClient.get({ client, collectionName: 'logs', query: {} })).to.be.rejected;
    });
});

describe('worker tests', () => {
    it('should insert documents into collection \'logs\'', async () => {
        const client = await mongoClient.connect(mongoURL);

        const docs = [{ name: 'Tom', age: 23 }, { name: 'Vicky', age: 32 }];

        assert.isOk(await mongoClient.insert({ client, collectionName: 'logs', docs }));
    });

    it('should get all documents from collection \'logs\'', async () => {
        const client = await mongoClient.connect(mongoURL);

        const docs = await mongoClient.get({ client, collectionName: 'logs' });

        expect(docs).length.gte(1);
    });

    it('should get documents from collection \'logs\' according to the query', async () => {
        const client = await mongoClient.connect(mongoURL);

        const docs = await mongoClient.get({ client, collectionName: 'logs', query: { name: 'Tom', age: 23 } });

        expect(docs).length.gte(1);
    });
});
