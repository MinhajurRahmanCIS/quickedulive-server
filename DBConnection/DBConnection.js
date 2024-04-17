const { MongoClient, ServerApiVersion } = require('mongodb');
//Online Connection

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ermhfxw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//Local Connection

const uri = 'mongodb://localhost:27017';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function dbConnect() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Quick Edu Live Server successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
};

// Database collections
const QELDB = client.db('quickEduLiveDatabase');
const classesCollection = QELDB.collection('classes');
const usersCollection = QELDB.collection('users');
const announcementsCollection = QELDB.collection('announcements');
const classworkCollection = QELDB.collection('classwork');


module.exports = {
    dbConnect,
    usersCollection,
    classesCollection,
    announcementsCollection,
    classworkCollection
}