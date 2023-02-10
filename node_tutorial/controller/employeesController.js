const data = {};
data.employees = require('../model/employees.json');

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

//logic incomplete 
const addNewEmployee = (req, res) => {
    res.json({
        "firstName": req.body.firstname,
        "lastName": req.body.lastname
    });
}

//logic incomplete 
const updateEmployee = (req, res) => {
    res.json({
        "firstName": req.body.firstname,
        "lastName": req.body.lastname
    });
}

//logic incomplete 
const deleteEmployee = (req, res) => {
    res.json({ "id": req.body.id });
}

//logic incomplete 
const getEmployee = (req,res) => {
    res.json({ "id": req.params.id});
}

module.exports = {
    getAllEmployees,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}