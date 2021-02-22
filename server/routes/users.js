const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

router.post('/signup', (req, res, next) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return (
            res.status(400).json({
                message: "Field name or password is incorrect"
            })
        )

    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (!err) {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                // name jest unique - wieć nie trzeba sprawdzać czy user istnieje 
                name,
                password: hash
            })
            user.save(err => {
                if (!err) {
                    res.status(200).json({
                        message: "Account is created",
                        user: {
                            name
                        }
                    })
                } else {
                    res.status(500).json({
                        message: "User is exist or other error with authorization.",
                        user: {
                            name
                        }
                    })
                }
            })
        } else {
            res.status(500).json({
                message: "Error with bcrypt",
                user: {
                    name
                }
            })
        }
    });

});

router.post('/login', (req, res, next) => {
    const { name, password } = req.body;
    const user = {
        name,
        password
    }

    User.findOne({ name }).then((doc) => {

        // gdy uzytkownik istnieje
        bcrypt.compare(password, doc.password, (err, result) => {
            if (!err) {
                result ? (
                    res.status(200).json({
                        message: "User log in",
                        user: {
                            name
                        }
                    })
                ) : (
                        // zle haslo
                        res.status(200).json({
                            message: "Authorization error",
                            user: {
                                name
                            }
                        })
                    )
            } else {
                res.status(200).json({
                    message: "Authorization error",
                    user: {
                        name
                    }
                })
                next();
            }
        });
    }).catch(err => {
        res.status(404).json({
            message: "Authorization error " + err,
            user,
        })
    })
})

module.exports = router;