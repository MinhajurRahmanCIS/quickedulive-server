const jwt = require('jsonwebtoken');

const generate_user_token = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
    return token;
};

module.exports = generate_user_token;