const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator");

//POST/functionup/interns
const createIntern = async function (req, res) {
    try {
        let requestBody = req.body
        const { name, mobile, email, collegeName } = requestBody; //params extraction

        //requestBody validation
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: `Invalid request body.` })
        }

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: `Invalid name in request body.` })
        }

        //MOBILE NUMBER VALIDATION
        if (!validator.isValid(mobile)) {
            return res.status(400).send({ status: false, message: `Mobile number is required for registration.` })
        }

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
            return res.status(400).send({
                status: false, message: `${mobile} is not a valid mobile number, Please provide a valid mobile number to continue`,
            });
        }

        //Checking whether the entered mobile no. is already used or not.
        const isMobileAlreadyUsed = await internModel.findOne({ mobile, isDeleted: false })
        if (isMobileAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${mobile} is already registered. Please try another mobile number.` });
        }

        //EMAIL VALIDATION
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: `Email Id is required for registration.` })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({
                status: false, message: `${email} is not a valid email. Please provide a valid Email address to continue.`,
            });
        }

        //Checking whether the entered email is already used or not.
        const isEmailAlreadyUsed = await internModel.findOne({ email, isDeleted: false });
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} is already registered. Please try another Email Id.` });
        }

        if (!validator.isValid(collegeName)) {
            return res.status(400).send({ status: false, message: `Invalid college name in request body.` })
        }

        const findCollegeForInternship = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!findCollegeForInternship) {
            return res.status(400).send({
                status: false, message: `${collegeName} doesn't exists.`,
            });
        }

        const collegeId = findCollegeForInternship._id
        const appliedCollege = findCollegeForInternship.fullName;
        requestBody["collegeId"] = collegeId;
        // console.log(collegeId);

        const savingInternDetails = await internModel.create(requestBody);
        return res.status(201).send({ status: true, message: `Successfully applied for internship at ${appliedCollege}.`, data: savingInternDetails })

    } catch (err) {
        return res.status(500).send({
            status: false,
            Error: err.message,
        });
    }
};
module.exports.createIntern = createIntern;