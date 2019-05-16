const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userData = require("../data/user")
const orderData = require("../data/order")

router.post("/profile", async (req, res) => {
    const sessionid = req.params.sessionid
    console.log(`GET Request: Search for sessionid: ${sessionid}`)
    try{
        const user = await userData.getUserBySessionId(Number(sessionid))
        console.log(user)
        const order = await orderData.getOrderById(user._id)
        console.log(order)
        res.render("profile", {user: user, order: order})
    } catch(err){
        console.log(err)
    }
})