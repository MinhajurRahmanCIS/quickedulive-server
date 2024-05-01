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

//Requiring gemini AI 
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

//Select gemini AI Model 
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
    ],
});




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
    console.log("req data /n", data)

    const classId = data.classId;
    const subject = data.subject;
    const quizNo = data.quizNo;
    const date = data.date;
    const time = data.time;
    const examDuration = data.duration + " " + data.timeUnit;
    const totalQuestions = data.totalQuestions;
    const level = data.level;
    const topic = data.topic;
    const questionPattern = 'a), b), c), d)';

    // Assignment
    const assignmentNo = data.assignmentNo;
    const example = data.example;
    const description = data.description;


    // const prompt =
    //     `Make ${subject} Question Provide correct answer. Subject: ${subject}. Total Question: ${totalQuestions}. Question Pattern: ${questionPattern}. give it in pure json format. Please stop giving starting ${"```json"} and ${"```"} don't give ${' \n \n'} 
    //     `
    //     ;
    let prompt;

    if (quizNo) {
        prompt =
            `Generate ${subject} questions with the topic ${topic} and provide the correct answers. Subject: ${subject}. Total Questions: ${totalQuestions}. Question Pattern: ${questionPattern}. Please provide the response in pure JSON format. Avoid using ${"json"} and ${""} to enclose the JSON.
            Carefully follow the Example:
        {
                "quizNo": ${quizNo},
                "classId": ${classId},  
                    "date": ${date}, 
                    "time": ${time}, 
                    "examDuration": ${examDuration}, 
                    "level": ${level}, 
                    "topic": ${topic},
                {
                    "questions": [
                        {"_id": "count on sequence",
                        "question": "",
                        "options": ["a)", "b)", "c)", "d)"],
                        "correctAnswer": ""
                    ]
                   }
        }
        `;
    }
    else {
        prompt = `Generate ${subject} assignment that contain these topics: ${topic} with a scenario and number of questions ${totalQuestions}. Please provide the response in pure JSON format. Avoid using ${"json"} and ${""} to enclose the JSON. Carefully follow the example:

    {
            "assignmentNo": ${assignmentNo},
            "classId": ${classId},  
            "date": ${date}, 
            "time": ${time},
            "level": ${level},
            "topic": ${topic}, 
            "scenario": "Write the scenario based on your question"
            {
                "questions": [
                    {"_id": "count on sequence",
                    "question": "${totalQuestions}"
                ]
               }
    }
    `;
    }

    console.log("prompt", prompt)

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    // Parse the JSON string into an array of objects
    // const textToArray = JSON.parse(text);

    let textToArray; // Declare textToArray outside of the try-catch block

    try {
        textToArray = JSON.parse(text);  // Continue here if parsing is successful
    } catch (error) {
        res.send("Something Went wrong. Please Try Again");
    }

    console.log("Response", textToArray);



    if (quizNo && (!textToArray?.quizNo || !textToArray?.classId || !textToArray?.date || !textToArray?.time || !textToArray?.examDuration || !textToArray?.level || !textToArray?.topic || classId != textToArray?.classId)) {
        return res.send("Something Went wrong. Please Try Again");
    }
    

    console.log(assignmentNo)

    if (assignmentNo && (!textToArray?.assignmentNo || !textToArray?.classId || !textToArray?.date || !textToArray?.time || !textToArray?.level || !textToArray?.scenario || !textToArray?.topic || classId != textToArray?.classId)) {
        return res.send("Something Went wrong. Please Try Again");
    }
    
    const classwork = postData(classworkCollection, textToArray);
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


    if (req.query.classId && req.query.quizNo || req.query.assignmentNo) {
        query = {
            classId: req.query.classId,
            $or: []
        };

        if (req.query.quizNo) {
            query.$or.push({ "quizNo": { $exists: true } });
        };

        if (req.query.assignmentNo) {
            query.$or.push({ "assignmentNo": { $exists: true } });
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
    };
});

// Getting Specific classwork
// app.get('/class/:id', verifyJWT, async (req, res) alternative for verifyJWT
app.get('/classwork/:id', async (req, res) => {
    const id = req.params.id;
    const getSpecificClasswork = getSpecificData(id, classworkCollection);
    getSpecificClasswork
        .then(result => {
            return res.send({
                success: true,
                message: "Specific Class work Found",
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