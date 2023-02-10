const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){ this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    //if no cookie in request and if any cookie is present, check for jwt cookie
    if(!cookies?.jwt){
        return res.sendStatus(401);
    } 
    const refreshToken = cookies.jwt;
    console.log("refreshToken recieved in request : ", refreshToken);

    const userFound = usersDB.users.find(user => user.refreshToken === refreshToken);
    if(!userFound){
        return res.sendStatus(403); //forbidden
    }

    //verify refresh token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || userFound.username != decoded.username) return res.sendStatus(403) //invalid token
            
            const roles = Object.values(userFound.roles);
            //generate new access token 
            const accessToken = jwt.sign(
                {
                    "userInfo" : {
                        "username":decoded.username,
                        "roles":roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({accessToken});
        }
    );
}

module.exports = {handleRefreshToken}
