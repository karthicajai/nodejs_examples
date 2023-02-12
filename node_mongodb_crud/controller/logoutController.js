const User = require('../model/User');
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    //if no cookie in request and if any cookie is present, check for jwt cookie
    if(!cookies?.jwt){
        return res.sendStatus(204); //No content
    } 
    const refreshToken = cookies.jwt;
    console.log("refreshToken recieved in request : ", refreshToken);

    const userFound = await User.findOne({refreshToken}).exec();
    if(!userFound){
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    userFound.refreshToken = '';
    const result = await userFound.save();
    console.log("User logged out ", result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = {handleLogout}
