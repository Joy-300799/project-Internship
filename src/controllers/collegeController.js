const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const validator = require("../validator/validator");

//POST /functionup/colleges
const createCollege = async function (req, res) {
    try {
        // res.setHeader('Access-Control-Allow-Origin', '*');
        let data = req.body;
        if (!validator.isValidRequestBody(data)) {
            return res
                .status(400)
                .send({ status: false, message: "No college detail given" });
        } else {
            //USING OBJECT DESTRUCTION METHOD HERE
            const { name, fullName, logoLink } = data;

            if (!validator.isValid(name)) {
                return res.status(400).send({
                    status: false,
                    message: "Name is mandatory. Please enter a valid name to create an entry.",
                });
            }

            if (!validator.isValid(fullName)) {
                return res.status(400).send({
                    status: false,
                    message: "FullName is required. Please enter a valid college name to create an entry.",
                });
            }

            if (!validator.isValid(logoLink)) {
                return res.status(400).send({
                    status: false,
                    message: "Logo link not found. Please provide the logo link to create an entry",
                });
            }

            const isNameAlreadyUsed = await collegeModel.findOne({ name, isDeleted: false });
            if (isNameAlreadyUsed) {
                return res
                    .status(400)
                    .send({ status: false, message: `${name} is already in used` });
            }
            const isLogoAlreadyUsed = await collegeModel.findOne({ logoLink, isDeleted: false });
            if (isLogoAlreadyUsed) {
                return res
                    .status(400)
                    .send({ status: false, message: `${logoLink} is already in used` });
            }

            //Removing unneccesary spaces from the string.
            const Name = name.toLowerCase().split(" ").join("");
            const trimFullName = fullName.trim();
            const trimLogoLink = logoLink.trim();

            data["name"] = Name;
            data["fullName"] = trimFullName;
            data["logoLink"] = trimLogoLink;

            //saving data in database
            const savedData = await collegeModel.create(data);
            return res.status(201).send({
                status: true,
                message: "College saved Successfully",
                data: savedData,
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            Error: error.message,
        });
    }
};

//GET/functionup/collegeDetails
const getCollegeDetails = async function (req, res) {
    try {
        //res.setHeader('Access-Control-Allow-Origin', '*');
        let body = req.query;
        if (!validator.isValidRequestBody(body)) {
            return res.status(400).send({
                status: false,
                message: "Query not found, Please provide a valid query to fetch details",
            });
        }

        let collegeName = req.query.collegeName;
        if (!validator.isValid(collegeName)) {
            return res.status(400).send({ status: false, messege: "Please provide The College Name" });
        }

        const lowerCollegeName = collegeName.toLowerCase();
        const findCollege = await collegeModel.findOne({ name: lowerCollegeName, isDeleted: false });
        if (!findCollege) {
            return res.status(400).send({
                status: false,
                message: `'${collegeName}' is not a valid college name. Please provide a valid college name to search interns details.`,
            });

        }
        let checkId = findCollege._id;
        let name = findCollege.name;
        let fullName = findCollege.fullName;
        let logoLink = findCollege.logoLink;

        const InternsApplied = await internModel
            .find({ collegeId: checkId, isDeleted: false })
            .select({ _id: 1, name: 1, email: 1, mobile: 1 });

        if (!InternsApplied.length > 0) {
            let Data = {
                name: name,
                fullName: fullName,
                logoLink: logoLink,
                interests: `No interns applied for ${fullName}`
            };
            return res.status(200).send({ status: true, data: Data });
        } else {
            let Data = {
                name: name,
                fullName: fullName,
                logoLink: logoLink,
                interests: InternsApplied,
            };
            return res.status(200).send({
                status: true,
                message: `Successfully fetched all interns details of ${fullName}`,
                data: Data,
            });
        }


    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails;