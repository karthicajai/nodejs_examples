const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async(req, res) => {
    const {username, pwd} = req.body;
    //return 400 (bad request status code)
    if(!username || !pwd){
        return res.status(400).json({ "message" : "Username and password are required."});
    } 

    const userFound = await User.findOne({username : username}).exec();
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
                {expiresIn: '300s'}
            );
            //generate refresh token
            const refreshToken = jwt.sign(
                {"username":userFound.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );

            userFound.refreshToken = refreshToken;
            const result = await userFound.save();
            console.log("User updated ", result);
            
            //set refresh token in cookie, then set it access only http and maxage to 1day
            //secure: true for production
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
