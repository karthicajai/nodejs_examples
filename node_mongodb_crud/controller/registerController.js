const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {username, pwd} = req.body;
    //return 400 (bad request status code)
    if(!username || !pwd){
        return res.status(400).json({ "message" : "Username and password are required."});
    } 
    
    const userFound = await User.findOne({username : username}).exec();
    if(userFound){
        //409 : conflict error code
        return res.status(409).json({"message" : "username already exist."});
    }

    try{
        //encrypt pwd
        const encryptedPwd = await bcrypt.hash(pwd, 10);
        //store in new user
        const result = await User.create({ 
            "username" : username, 
            "password" : encryptedPwd
        });

        console.log("New user created ", result);
        //201: response code for new resource created
        res.status(201).json({"message" : "Success, New user created!."})

    } catch(err) {
        //500: internal server error
        res.status(500).json({"message" : err.message});
    }
}

module.exports = { handleNewUser }