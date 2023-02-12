const verifyRoles = (... inAllowedRoles) => {

    return (req, res, next) =>{
       
        if(!req?.roles) return res.sendStatus(401);

        const allowedRoles = [...inAllowedRoles];
        console.log(allowedRoles);
        console.log(req.roles);
        const result = req.roles.map(role => allowedRoles.includes(role)).find(val => val === true);
        
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles