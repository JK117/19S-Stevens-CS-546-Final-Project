const express = require("express")
const router = express.Router()
const userData = require("../data/user")
const modelData = require("../data/vehicle_model")

router.get("/:id", async (req, res) => {
    const userName = req.params.id

    try {
        const user = await userData.getUserByUserName(userName)
        const models = await modelData.getAllVehicleModels()
        res.render("view", {
            user: user.data,
            id: user.data._id,
            sessionId: userName,
            result: models.data
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router