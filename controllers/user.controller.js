const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");


function signUp(req, res){

    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(result => {
        if(result){
            return res.status(409).json({
                message: "Email already exists!"
            })
        }else{
            bcryptjs.genSalt(10, function(err, salt){
                bcryptjs.hash(req.body.password, salt, function(err, hash){
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }

                    const schema = {
                        name: {type: "string", optional: false, max: "150"},
                        email: {type: "email", optional: false, max: "255"},
                        password: {type: "string", optional: false, max: "100"}
                    }

                    const v = new Validator();
                    const validationResponse = v.validate(user, schema)

                    if(validationResponse !== true){
                        return res.status(400).json({
                            message: "Validation fails!",
                            errors: validationResponse
                        })
                    }

                    models.User.create(user).then(result => {
                        res.status(201).json({
                            message: "Created User successfully!",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                            error: error
                        })
                    })
                })
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

function login(req, res){
    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if(user === null){
            return res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, process.env.JWT_KEW, function(err, token){
                        res.status(200).json({
                            message: "Authentication sucessful!",
                            token: token
                        })
                    })
                }else{
                    return res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

module.exports = {
    signUp: signUp,
    login: login
}