const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer')){
        return res.sendStatus(401);
    }
    //get access token from header. header looks like "Bearer token"
    accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403) //invalid token
            req.user = decoded.userInfo.username; //get username from decoded jwt
            req.roles = decoded.userInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT