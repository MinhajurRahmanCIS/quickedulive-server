const jwt = require('jsonwebtoken');

// User JWT Token Generate Function
const generate_user_token = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    // const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    return token;
};

// JWT Verify Function
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authentication;
    if (!authHeader) {
        res.send({ message: "unauthorize access" });
        // res.status(401).res.send({ message: "unauthorize access" });
        return;
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            res.send({ message: "unauthorize access" });
            // res.status(401).res.send({ message: "unauthorize access" });
            return;
        };
        req.decoded = decoded;
        next();
    });
};

module.exports = { generate_user_token, verifyJWT };