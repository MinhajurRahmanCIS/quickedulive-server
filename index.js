const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//Requiring MongoDB Connection & Collections
const { dbConnect,
    usersCollection,
    classesCollection,
    announcementsCollection,
    classworkCollection
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

// Requiring JWT Function to get user_token, verifyJWT user, verifyAdmin
const { user_token,
    verifyJWT,
    verifyAdmin
} = require('./JWT_Token/JWT_Token');

// JWT user Token generate
app.get('/jwt', (req, res) => {
    const email = req.query.email;
    const userToken = user_token(email, usersCollection);
    userToken
        .then(accessToken => {
            return res.send({
                success: true,
                message: "User Token Generated",
                data: accessToken,
            });
        })
        .catch(err => {
            return res.send({
                success: false,
                message: err?.message
            })
        });
});

// Users
// Getting Users 

app.get('/users', async (req, res) => {
    // Showing Specific Email User 
    let query = {};
    if (req.query.email) {
        query = {
            email: req.query.email
        };
    };
    const getUser = getData(usersCollection, query);
    getUser
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
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const getSpecificUser = getSpecificData(id, usersCollection);
    getSpecificUser
        .then(result => {
            return res.send({
                success: true,
                message: "Specific User Found",
                data: result
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
app.post('/users', async (req, res) => {
    const data = req.body;
    const user = postData(usersCollection, data);
    user
        .then(result => {
            return res.send({
                success: true,
                message: "New User Added",
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

// UpdateUser
// app.put('/class/:id', async (req, res) alternative for verifyJWT
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    const options = { upsert: true };
    const updatedUserData = {
        $set: {
            name: userData.name
        }
    };
    const userClass = updateData(id, updatedUserData, options, usersCollection);
    userClass
        .then(result => {
            return res.send({
                success: true,
                message: "User Updated",
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

// Deleting Users
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const deleteUser = deleteData(id, usersCollection);
    deleteUser
        .then(result => {
            return res.send({
                success: true,
                message: "Users Deleted",
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


// Classes
// Getting Classes 
// app.get('/class', verifyJWT, async (req, res) alternative for verifyJWT

app.get('/classes', async (req, res) => {
    // const email = req.query.email;
    // const decodedEmail = req.decoded.email;

    // if (email !== decodedEmail) {
    //     return res.status(403).send({ message: 'forbidden access' });
    // };
    // Showing Specific Email Classes 
    let query = {};

    if (req.query.email) {
        query = {
            email: req.query.email
        };
    };

    const getClass = getData(classesCollection, query);
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
app.get('/classes/:id', async (req, res) => {
    const id = req.params.id;
    const getSpecificClass = getSpecificData(id, classesCollection);
    getSpecificClass
        .then(result => {
            return res.send({
                success: true,
                message: "Specific Class Found",
                data: result
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
app.post('/classes', async (req, res) => {
    const data = req.body;
    const newClass = postData(classesCollection, data);
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
app.put('/classes/:id', async (req, res) => {
    const id = req.params.id;
    const classData = req.body;
    const options = { upsert: true };
    const updatedClassData = {
        $set: {
            name: classData.name
        }
    };
    const updateClass = updateData(id, updatedClassData, options, classesCollection);
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
app.delete('/classes/:id', async (req, res) => {
    const id = req.params.id;
    const deleteClass = deleteData(id, classesCollection);
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




// Announcements
// Getting Announcements 
// app.get('/announcements', verifyJWT, async (req, res) alternative for verifyJWT

app.get('/announcements', async (req, res) => {
    // Showing Specific Email Classes 
    let query = {};
    if (req.query.classId) {
        query = {
            classId: req.query.classId
        };
    };

    let sortOption = {};
    if (req.query.sorted) {
        sortOption['_id'] = parseInt(req.query.sorted); // Sort ascending if sortField is provided
    } else {
        sortOption['_id'] = 1; // Sort by _id field ascending if sortField is not provided
    };

    const getAnnouncements = getData(announcementsCollection, query, sortOption);
    getAnnouncements
        .then(result => {
            return res.send({
                success: true,
                message: "Announcements Found!!",
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

// Creating new Announcements
// app.post('/announcements', async (req, res) alternative for verifyJWT
app.post('/announcements', async (req, res) => {
    const data = req.body;
    const newAnnouncement = postData(announcementsCollection, data);
    newAnnouncement
        .then(result => {
            return res.send({
                success: true,
                message: "Announcement Created",
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

// Creating new classwork
// app.post('/classwork', async (req, res) alternative for verifyJWT
app.post('/classwork', async (req, res) => {
    const data = req.body;
    const classwork = postData(classworkCollection, data);
    classwork
        .then(result => {
            return res.send({
                success: true,
                message: "Classwork Created",
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

app.get('/classwork', async (req, res) => {
    // const email = req.query.email;
    // const decodedEmail = req.decoded.email;

    // if (email !== decodedEmail) {
    //     return res.status(403).send({ message: 'forbidden access' });
    // };
    // Showing Specific Email Classes 
    let query = {};

    if (req.query.classId) {
        query = {
            classId: req.query.classId
        };
    };

    const getClasswork = getData(classworkCollection, query);
    getClasswork
        .then(result => {
            return res.send({
                success: true,
                message: "Class work Found!!",
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

//Root Directory of Server
app.get('/', (req, res) => {
    res.send('Quick Edu Live Server is Running!!!');
});

// 404 Route of Server
app.all('*', (req, res) => res.send({
    status: 404,
    message: `Route Not Found!`
}));

app.listen(port, () => {
    console.log(`Quick Edu Live Server is Running on PORT : ${port}`);
});