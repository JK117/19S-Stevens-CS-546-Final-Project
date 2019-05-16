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
        console.log(`Successful POST Request: Signed up for ${signUpData.userName}`)
    } catch (e) {
        res.status(500).json({
            error: "At post /user " + e
        })
    }
})

router.post("/login", async (req, res) => {
    //console.log("Trying to /user/login");
    const userName = req.body.userName;
    const userPwd = req.body.hashedPwd;
    // username and password must be valid, checked in LoginPage.jsx
    try {
        const user = await userData.getUserByUserName(userName);
        if (user.success) { // Found name in database
            const hashedPwd = user.data.hashedPwd;
            const match = await bcrypt.compare(userPwd, hashedPwd);
            if (match) { // Password match
                res.json({
                    isFind: true,
                    msg: "Welcome back " + userName,
                    sessionId: user.data.sessionId,
                    identity: user.data.identity
                });
            } else { // Errr password not match
                res.json({
                    isFind: false,
                    msg: "Password is not matched!"
                });
            }
        } else { // Username not found in database
            res.json({
                isFind: false,
                msg: "Username is not found!"
            });
        }
    } catch (e) {
        res.status(500).json({
            error: "At post /user/login " + e
        });
    }
});

module.exports = router