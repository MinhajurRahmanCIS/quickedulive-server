const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//Requiring MongoDB Connection & Collections
const { dbConnect,
    classCollection
} = require('./DBConnection/DBConnection');

//Requiring CRUD Functions
const { getData,
    getSpecificData,
    postData,
    updateData,
    deleteData
} = require('./CRUD/CRUD');


//Middleware
app.use(cors());
app.use(express.json());
// Requiring User JWT Token Generate Function
const { generate_user_token, verifyJWT } = require('./JWT_Token/JWT_Token');

//MongoDb Connection
dbConnect().catch(console.dir + 'MongoDb Connection Error');

// JWT user Token generate
app.post('/jwt', (req, res) => {
    const user_Token = generate_user_token(req.body);
    user_Token
        .then(token => {
            return res.send({
                success: true,
                message: "User Token Generated",
                data: { token },
            });
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// Class CRUD
// Getting Classes 
// app.get('/class', verifyJWT, async (req, res) alternative for verifyJWT

app.get('/class', async (req, res) => {

    /* verify JWT with email */
    // const decoded = req.decoded;
    // if (decoded.email !== req.query.email) {
    //     res.send({ message: "unauthorize access" });
    //     // res.status(403).res.send({ message: "unauthorize access" });
    // };

    // Showing Specific Email Classes 
    let query = {};
    
    if (req.query.email) {
        query = {
            email: req.query.email
        };
    };

    // const search = req.query.search;
    // if (search) {
    //     query = {
    //         $text: {
    //             $search: search
    //         }
    //     };
    // };

    const getClass = getData(classCollection, query);
    getClass
        .then(result => {
            return res.send({
                success: true,
                message: "Class Found!!",
                data: result,
            });
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// Getting Specific Class
// app.get('/class/:id', verifyJWT, async (req, res) alternative for verifyJWT
app.get('/class/:id', async (req, res) => {
    const id = req.params.id;
    const getSpecificClass = getSpecificData(id, classCollection);
    getSpecificClass
        .then(result => {
            return res.send({
                success: true,
                message: "Specific Class Deleted",
                data: result,
            })
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// Creating new class
// app.post('/class', async (req, res) alternative for verifyJWT
app.post('/class', async (req, res) => {
    const data = req.body;
    const newClass = postData(classCollection, data);
    newClass
        .then(result => {
            return res.send({
                success: true,
                message: "New Class Created",
                data: result,
            })
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// UpdateClass
// app.put('/class/:id', async (req, res) alternative for verifyJWT
app.put('/class/:id', async (req, res) => {
    const id = req.params.id;
    const classData = req.body;
    const options = { upsert: true };
    const updatedClassData = {
        $set: {
            name: classData.name
        }
    };
    const updateClass = updateData(id, updatedClassData, options, classCollection);
    updateClass
        .then(result => {
            return res.send({
                success: true,
                message: "Class Updated",
                data: result,
            })
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// Deleting Classes
// app.delete('/class/:id', async (req, res) alternative for verifyJWT
app.delete('/class/:id', async (req, res) => {
    const id = req.params.id;
    const deleteClass = deleteData(id, classCollection);
    deleteClass
        .then(result => {
            return res.send({
                success: true,
                message: "Class Deleted",
                data: result,
            })
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

//Root Directory of Server
app.get('/', (req, res) => {
    res.send('Quick Edu Live Server is Running!!!');
});

app.listen(port, () => {
    console.log(`Quick Edu Live Server is Running on PORT : ${port}`);
});