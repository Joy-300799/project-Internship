const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController");
const internController = require("../controllers/internController");


router.post("/functionup/colleges", collegeController.createCollege) //Creating college entry

router.post("/functionup/interns", internController.createIntern) // Creating Intern's entry

router.get("/functionup/collegeDetails", collegeController.getCollegeDetails) //Fetching all intern's details with a specific college.

module.exports = router;