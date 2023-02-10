const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){ this.users = data }
}

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

    const userFound = usersDB.users.find(user => user.refreshToken === refreshToken);
    if(!userFound){
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    //remove refresh token from current user in DB of File
    const otherUsers = usersDB.users.filter(user => user.username !== userFound.username);
    const currentUser = {...userFound, "refreshToken":''};
    usersDB.setUsers([...otherUsers, currentUser]);

    //write to File or DB
     await fsPromises.writeFile(
        path.join(__dirname, '../model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = {handleLogout}
