const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const userData = require("../data/user")

// router.get("/", (req, res) => {
//     res.render("signup", {title: "Car Rental"})
// })

router.post("/", async (req, res) => {
    const formData = req.body
    console.log(`POST Request: Sign up for ${formData.userName}`)
    try {
        const foundUser = await userData.getUserByUsername(formData.userName)
        if (foundUser.success) {
            res.json({
                success: false
            })
            return
        }
        formData.hashedPwd = await bcrypt.hash(formData.hashedPwd, 10)
        const newPost = await userData.addUser(formData)
        res.json({
            success: newPost.success,
            sessionId: newPost.data.sessionId,
            identity: newPost.data.identity
        })
    } catch (e) {
        res.status(500).json({
            error: "At post /user " + e
        })
    }
})

module.exports = router