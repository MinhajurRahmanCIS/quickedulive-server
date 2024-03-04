const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
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

//MongoDb Connection
dbConnect().catch(console.dir + 'MongoDb Connection Error');


// Class CRUD
// Getting Classes
app.get('/class', async (req, res) => {
    const getClass = getData(classCollection);
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

// Creating new classes
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