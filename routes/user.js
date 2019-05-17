const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const userData = require("../data/user")

router.post("/signup", async (req, res) => {
    const signUpData = req.body
    console.log(`POST Request: Sign up for ${signUpData.userName}`)
    try {
        const user = await userData.getUserByUserName(signUpData.userName)
        if (user.success) {
            res.json({
                success: false
            })
            return
        }
        signUpData.hashedPwd = await bcrypt.hash(signUpData.hashedPwd, 10)
        const userInsert = await userData.addUser(signUpData)
        res.json({
            success: userInsert.success,
            sessionId: userInsert.data.sessionId,
            identity: userInsert.data.identity
        })
        console.log(`Successful POST Request: ${signUpData.userName} successfully signed up.`)
    } catch (e) {
        res.status(500).json({
            error: "At post /user " + e
        })
    }
})

router.post("/login", async (req, res) => {
    const userName = req.body.userName
    const userPwd = req.body.hashedPwd

    if (!userName) {
        res.status(400).render("error", {
            msg:"You must input a user name!"
        })
        return
    }

    if (!userPwd) {
        res.status(400).render("error", {
            msg:"You must input a password!"
        })
        return
    }
    
    console.log(`POST Request: Login up for ${userName}`)
    try {
        const user = await userData.getUserByUserName(userName)
        if (user.success) {
            // user name is found in database
            const hashedPwd = user.data.hashedPwd
            const match = await bcrypt.compare(userPwd, hashedPwd)

            if (match) {
                // the hashed password matches
                console.log(`Successful POST Request: ${userName} successfully logged in.`)

                req.session.regenerate(function(err) {
                    if(err){
                        return res.json({ret_code: 2, ret_msg: 'login failed'})
                    }
                    
                    req.session.userName = userName
                    res.json({ret_code: 0, ret_msg: '登录成功'})
                    res.render("temp", {
                        user: user.data,
                        session: req.session
                    })
                    // res.json(req.session)
                })

                // res.json({
                //     isFind: true,
                //     msg: "Welcome back " + userName,
                //     sessionId: user.data.sessionId,
                //     identity: user.data.identity
                // })
            } else { 
                // the hashed password does not match
                console.log(`Unsuccessful POST Request: password does not match.`)
                res.status(400).render("error", {
                    msg:"Password does not match!"
                })
                // res.json({
                //     isFind: false,
                //     msg: "Password is not matched!"
                // });
            }
        } else {
            // user name is not found in database
            console.log(`Unsuccessful POST Request: username does not exist.`)
            res.status(400).render("error", {
                msg:"Username does not exist!"
            })
            // res.json({
            //     isFind: false,
            //     msg: "Username is not found!"
            // })
        }
    } catch (e) {
        res.status(500).json({
            error: "At post /user/login: " + e
        })
    }
})

module.exports = router