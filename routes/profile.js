const express = require("express")
const router = express.Router()
const userData = require("../data/user")
const orderData = require("../data/order")

router.get("/:id", async (req, res) => {
    const sessionid = req.session.userName
    console.log(`GET Request: Search for sessionid: ${sessionid}`)
    try{
        const user = await userData.getUserBySessionId(sessionid)
        const order = await orderData.getOrderByUserId(user.data._id)
        console.log(order)
        res.render("profile", {user: user.data, order: order.data})
    } catch(err){
        console.log(err)
    }
})

module.exports = router;