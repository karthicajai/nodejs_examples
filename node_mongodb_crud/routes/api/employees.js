const express = require('express');
const router = express.Router();
const employeesConstroller = require('../../controller/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

//routers
router.route('/')
    .get(employeesConstroller.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), employeesConstroller.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), employeesConstroller.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), employeesConstroller.deleteEmployee);

router.route('/:id')
    .get(employeesConstroller.getEmployee);


module.exports = router;