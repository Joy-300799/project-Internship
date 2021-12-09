const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator");

//POST/functionup/interns
const createIntern = async function(req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        let data = req.body;
        if (!validator.isValidRequestBody(data)) {
            //validating whether data is given in request body or not
            return res.status(400).send({
                status: false,
                message: "No intern details given. Please provide an intern's details to proceed further.",
            });
        } else {
            //USING OBJECT DESTRUCT METHOD HERE
            const { name, email, mobile, collegeName } = data;

            if (!validator.isValid(name)) {
                //Validating name
                return res.status(400).send({
                    status: false,
                    message: "Name is required. Please provide a valid name to continue.",
                });
            }

            if (!validator.isValid(email)) {
                //Validating email
                return res.status(400).send({
                    status: false,
                    message: "Email Id is required. Please provide a valid email address to continue.",
                });
            }

            if (!validator.isValid(mobile)) {
                //Validating mobile
                return res.status(400).send({
                    status: false,
                    message: "Mobile number is required. Please provide a valid mobile number to continue.",
                });
            }

            if (!validator.isValid(collegeName)) {
                //validating collegeName
                return res.status(400).send({
                    status: false,
                    message: "College name is required, Please enter a valid college name to continue.",
                });
            }

            //EMAIL VALIDATION
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return res.status(400).send({
                    status: false,
                    message: `${email} is not a valid email. Please provide a valid Email address to continue.`,
                });
            }

            //MOBILE NUMBER VALIDATION
            if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
                return res.status(400).send({
                    status: false,
                    message: `${mobile} is not a valid mobile number, Please provide a valid mobile number to continue`,
                });
            }

            //Checking whether the entered email & mobile no. is already used or not.

            const isEmailAlreadyUsed = await internModel.findOne({ email, isDeleted: false });
            if (isEmailAlreadyUsed) {
                return res
                    .status(400)
                    .send({ status: false, message: `${email} is already used by somebody else` });
            }
            const isMobileAlreadyUsed = await internModel.findOne({ mobile, isDeleted: false });
            if (isMobileAlreadyUsed) {
                return res
                    .status(400)
                    .send({ status: false, message: `${mobile} is already used by somebody else` });
            }

            const trimName = name.trim(); //removing unneccesary spaces from name.
            data["name"] = trimName;

            //saving data in database
            let find = await collegeModel.findOne({ isDeleted: false, $or: [{ name: collegeName }, { fullName: collegeName.trim() }] }); //Accepting the trimed value of collegeName.
            if (!find) {
                let CollegeName = collegeName.toLowerCase().split(" ").join(""); //converting college name to lowercase and removing unneccesary spaces.

                let againFind = await collegeModel.findOne({ name: CollegeName, isDeleted: false });
                if (!againFind) {
                    return res.status(400).send({
                        status: false,
                        message: `The ${collegeName} doesn't exists`,
                    });
                } else {
                    let collegeId = againFind._id;
                    data["collegeId"] = collegeId;
                    let college = againFind.fullName; //showing the college name in response to make it more specific.

                    let savedData = await internModel.create(data);
                    res.status(201).send({
                        status: true,
                        message: `Successfully applied for internship at ${college}`,
                        data: savedData,
                    });
                    return;
                }
            } else {
                let collegeId = find._id;
                let college = find.fullName; //showing the college name in response to make it more specific.
                data["collegeId"] = collegeId;
                let savedData = await internModel.create(data);
                res.status(201).send({
                    status: true,
                    message: `Successfully applied for internship at ${college}`,
                    data: savedData,
                });
                return;
            }
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};
module.exports.createIntern = createIntern;