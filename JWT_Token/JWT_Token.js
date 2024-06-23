const jwt = require('jsonwebtoken');

// User JWT Token Generate Function
const user_token = async (email, collection) => {
    const query = { email: email };
    console.log("JWT", email)
    const user = await collection.findOne(query);
    if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN)
        return { accessToken: token };
    };
    return { accessToken: "" };
};


// User JWT Verify Function
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("unauthorized access");
    };

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "forbidden access" })
        }
        req.decoded = decoded;
        next();
    });
};

// Admin/Teacher JWT Verify Function
const verifyAdmin = async (req, res, next) => {
    const decodedEmail = req.decoded.email;
    const query = { email: decodedEmail };
    const user = await usersCollection.findOne(query);

    if (user?.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" })
    }
    next();
};

module.exports = { user_token, verifyJWT, verifyAdmin };