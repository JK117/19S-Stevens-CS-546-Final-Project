const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const userData = require("../data/user")
const modelData = require("../data/vehicle_model")

router.post("/signup", async (req, res) => {
    const signUpData = req.body
    console.log(`POST Request: Sign up for ${signUpData.userName}`)
    try {
        const user = await userData.getUserByUserName(signUpData.userName)
        if (user.success) {
            console.log(`User name ${signUpData.userName} already exists.`)
            res.status(500).render("error", {
                msg: `User name ${signUpData.userName} already exists.`
            })
            return
        }
        signUpData.hashedPwd = await bcrypt.hash(signUpData.hashedPwd, 10)
        signUpData.sessionId = signUpData.userName

        const userInsert = await userData.addUser(signUpData)
        if (userInsert.success) {
            console.log(`Successful POST Request: ${signUpData.userName} successfully signned up.`)
            const user = await userData.getUserByUserName(signUpData.userName)
            const models = await modelData.getAllVehicleModels()

            req.session.regenerate(function (err) {
                if (err) {
                    console.log(`Error occurred when generating session: ${err}`)
                    res.status(500).render("error", {
                        msg: "Error occurred when generating session."
                    })
                    return
                }

                req.session.userName = signUpData.userName

                console.log(`Successful POST Request: ${signUpData.userName} successfully signed up.`)
                console.log(`user.data._id: ${user.data._id}`)
                res.render("view", {
                    user: user.data,
                    id: user.data.id,
                    sessionId: req.session.userName,
                    result: models.data
                })
            })
        } else {
            console.log(`Error occurred when creating new user in database: ${e}`)
            res.status(500).render("error", {
                msg: "Error occurred when creating new user in database."
            })
        }
    } catch (e) {
        console.log(`Error occurred when signning up: ${e}`)
        res.status(500).render("error", {
            msg: "Error occurred when signning up."
        })
    }
})

router.post("/login", async (req, res) => {
    const userName = req.body.userName
    const userPwd = req.body.hashedPwd

    console.log(`POST Request: Login up for ${userName}`)
    try {
        const user = await userData.getUserByUserName(userName)
        const models = await modelData.getAllVehicleModels()

        if (user.success) {
            // user name is found in database
            const hashedPwd = user.data.hashedPwd
            const match = await bcrypt.compare(userPwd, hashedPwd)

            if (match) {
                // the hashed password matches
                console.log(`Successful POST Request: ${userName} successfully logged in.`)
                req.session.regenerate(function (err) {
                    if (err) {
                        console.log(`Error occurred when generating session: ${err}`)
                        res.status(500).render("error", {
                            msg: "Error occurred when generating session."
                        })
                    }

                    req.session.userName = userName
                    user.sessionId = req.session.userName

                    console.log(`user.data._id: ${user.data._id}`)
                    res.render("view", {
                        user: user.data,
                        id: user.data.id,
                        sessionId: req.session.userName,
                        result: models.data
                    })
                    // res.json(req.session)
                })
            } else {
                // the hashed password does not match
                console.log(`Unsuccessful POST Request: password does not match.`)
                res.status(500).render("error", {
                    msg: "Password does not match!"
                })
            }
        } else {
            // user name is not found in database
            console.log(`Unsuccessful POST Request: username does not exist.`)
            res.status(500).render("error", {
                msg: "Username does not exist!"
            })
        }
    } catch (e) {
        console.log(`Error occurred when logging in: ${e}`)
        res.status(500).render("error", {
            msg: "Error occurred when logging in."
        })
    }
})

module.exports = router