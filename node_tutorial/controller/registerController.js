const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){ this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const {username, pwd} = req.body;
    //return 400 (bad request status code)
    if(!username || !pwd){
        return res.status(400).json({ "message" : "Username and password are required."});
    } 
    //409 : conflict error code
    const userFound = usersDB.users.find(user => user.username === username);
    if(userFound){
        return res.status(409).json({"message" : "username already exist."});
    }

    try{
        //encrypt pwd
        const encryptedPwd = await bcrypt.hash(pwd, 10);
        //store in new user
        const newUser = { 
            "username" : username, 
            "roles": {"User": 2001},
            "password" : encryptedPwd
        };
        
        //instead of adding "new user" to "previous user list"
        //replace the "previous user list" with "previous user list" + "new user"
        usersDB.setUsers([...usersDB.users, newUser]);

        //write to File or DB
        await fsPromises.writeFile(
            path.join(__dirname, '../model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        console.log("New user created ", newUser);
        //201: response code for new resource created
        res.status(201).json({"message" : "Success, New user created!."})

    } catch(err) {
        //500: internal server error
        res.status(500).json({"message" : err.message});
    }
}

module.exports = { handleNewUser }