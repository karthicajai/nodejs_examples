const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    //find() will return all data
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({message: "No employees found"});
    res.json(employees);
}

const createNewEmployee = async (req, res) => {

    console.log(req.body.firstname);
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({ "message" : "First and Last names are required."});
    }

    try{
        const result = await Employee.create({ 
            firstname: req.body.firstname, 
            lastname: req.body.lastname
        });

        console.log("New Employee created ", result);
        //201: response code for new resource created
        res.status(201).json(result)
    }catch(err){
        //500: internal server error
        res.status(500).json({"message" : err.message});
    }
}

const updateEmployee = async (req, res) => {

    if(!req?.body?.id){
        return res.status(400).json({ "message" : "Id parameter is required."});
    }

    const employee = await Employee.findOne({_id : req.body.id}).exec();
    if(!employee){
        return res.status(204).json({"message": "Employee with given id not found"}); 
    }

    if(req.body?.firstname) employee.firstname = req.body.firstname;
    if(req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.json(result);
}

//logic incomplete 
const deleteEmployee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({ "message" : "Id parameter is required."});
    }

    const employee = await Employee.findOne({_id : req.body.id}).exec();
    if(!employee){
        return res.status(204).json({"message": "Employee with given id not found"}); 
    }
   
    const result = await employee.deleteOne({_id : req.body.id});
    res.json(result);
}

//logic incomplete 
const getEmployee = async (req,res) => {
    if(!req?.params?.id){
        return res.status(400).json({ "message" : "Id parameter is required."});
    }

    const employee = await Employee.findOne({_id : req.params.id}).exec();
    if(!employee){
        return res.status(204).json({"message": "Employee with given id not found"}); 
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}