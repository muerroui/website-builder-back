const mongodb = require('mongodb');
const jwt = require("jsonwebtoken");

let db = require('../config/keys').mongoURI;
mongodb.connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
      db = client.db()
    }
)

exports.registerNewUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            type: "bad-request",
            msg: 'You must specify the email and the password of the user'
        })
    }
    try {
        let user = {
            email: req.body.email,
            password: req.body.password
        };

        db.collection('users').insertOne(user, function (
            err,
            info
        ) {
            console.log('test');
            res.status(200).json({
                msg: "New user created",
                data: info.ops[0]
            })
        })        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

exports.loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            type: "bad-request",
            msg: 'You must specify the email and the password of the user'
        })
    }
    const login = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        const user = await db.collection('users').findOne({ email: login.email });

        console.log('usserr', user);

        //check if user exit
        if (!user) {
            res.status(404).json({
                type: "not-found",
                msg: "Wrong Login Details"
            })
        }

        let match = login.password === user.password;

        if (match) {
            let token = await jwt.sign({
                user
            }, "secret", {
                    expiresIn: 604800
                })

            if (token) {
                res.status(200).json({
                    success: true,
                    token: token,
                    userCredentials: user
                })
            }
        } else {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }
}