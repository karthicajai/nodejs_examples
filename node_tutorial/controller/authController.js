const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){ this.users = data }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async(req, res) => {
    const {username, pwd} = req.body;
    //return 400 (bad request status code)
    if(!username || !pwd){
        return res.status(400).json({ "message" : "Username and password are required."});
    } 

    const userFound = usersDB.users.find(user => user.username === username);
    if(!userFound){
        //401: Unauthorized
        return res.status(401).json({"message" : "username not found."});
    }

    try{
        const pwdMatch = await bcrypt.compare(pwd, userFound.password);
        if(pwdMatch){

            const roles = Object.values(userFound.roles);
            //generate access token
            const accessToken = jwt.sign(
                {
                    "userInfo" : {
                        "username":userFound.username,
                        "roles":roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            //generate refresh token
            const refreshToken = jwt.sign(
                {"username":userFound.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );

            //adding refresh token to current user in file or DB
            const otherUsers = usersDB.users.filter(user => user.username !== userFound.username);
            const currentUser = {...userFound, refreshToken};
            usersDB.setUsers([...otherUsers, currentUser]);

            //write to File or DB
            await fsPromises.writeFile(
                path.join(__dirname, '../model', 'users.json'),
                JSON.stringify(usersDB.users)
            );
            
            //set refresh token in cookie, then set it access only http and maxage to 1day
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            //send accessToken in response, so frontend develper will use it
            res.status(200).json({accessToken});
        } else {
            res.status(401).json({"message": "Incorrect password"})
        }
    }catch(err){
        //500: internal server error
        res.status(500).json({"message" : err.message});
    }
}

module.exports = {handleLogin}
