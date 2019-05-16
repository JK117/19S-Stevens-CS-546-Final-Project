const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userData = require("../data/user")

router.post("/signup", async (req, res) => {
    const formData = req.body;
    try {
        const foundUser = await userData.getUserByUsername(formData.username)
        if (foundUser.success) {
            res.json({
                success: false
            })
            return
        }
        formData.hashedPassword = await bcrypt.hash(formData.hashedPassword, 10)
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