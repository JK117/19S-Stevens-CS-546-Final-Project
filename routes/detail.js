const express = require("express")
const moment = require("moment")
const router = express.Router()
const userData = require("../data/user")
const modelData = require("../data/vehicle_model")
const siteData = require("../data/site")
const vehicleData = require("../data/vehicle")
const orderData = require("../data/order")

router.get("/:id", async (req, res) => {
    const vehicleModelId = req.params.id
    try {
        const model = await modelData.getVehicleModelById(req.params.id)
        const sites = await siteData.getAllSites()

        res.render("detail", {
            detail: model.data, 
            siteList: sites.data
        })

        // res.json(sites.data)
    } catch (e) {
        res.status(404).render("error", {
            title: "Cannot find the vehicle model", 
            error: e
        })
    }
});

router.post("/", async (req, res) => {
    const orderInfo = req.body

    if (!!orderInfo) {

        try {
            // Get user
            const user = await userData.getUserBySessionId(req.session.userName)
            // const user = user.data

            // Get vehicle model
            const vehicleModel = await modelData.getVehicleModelById(orderInfo.vehicleModelId)
            const vehicleModelName = vehicleModel.data.vehicleModel
            const vehicleModelId = vehicleModel.data._id
            const vehicleModelInStorage = vehicleModel.data.inStorage

            // Get available vehicles
            const vehicles = await vehicleData.getVehicleBySiteAndModelAndStatus(orderInfo.from, vehicleModelName)
            // Select one from available vehicles
            if (vehicles.data.length == 0) {
                res.render("order_error", {
                    msg: "No vehicle available at the designated pick-up site, please make another selection.", 
                    id: vehicleModelId
                })
                return
            }
            const vehicle = vehicles.data[0]

            // Calculate total charge
            const dropOffDate = moment(orderInfo.dropOffDate, "YYYY-MM-DD")
            const pickUpDate = moment(orderInfo.pickUpDate, "YYYY-MM-DD")
            const totalCharge = ((dropOffDate - pickUpDate) / 1000 / (24*60*60) + 1) * orderInfo.dailyCharge

            // Create new order
            const newOrder = {
                "userId": user.data._id, 
                "vehicleId": vehicle._id, 
                "vehicleModel": vehicleModelName, 
                "from": orderInfo.from, 
                "to": orderInfo.to, 
                "pickUpDate": orderInfo.pickUpDate, 
                "dropOffDate": orderInfo.dropOffDate, 
                "totalCharge": totalCharge
            }
            
            // Insert new order
            const insertNewOrder = await orderData.addOrder(newOrder)
            if (insertNewOrder.success) {
                console.log("New order inserted")

                // Update vehicle model storage -> -1
                const desVehicleModelStorageNum = await modelData.desVehicleInStorageById(vehicleModelId)
                if (desVehicleModelStorageNum.success) {
                    console.log("Vehicle model inStorage number - 1")

                    // Update vehicle inStorage -> false
                    const updateVehicleStatus = await vehicleData.updateVehicleStatuById(vehicle._id, false)
                    if (updateVehicleStatus.success) {
                        console.log("Vehicle inStorage status changed to false")

                        // Update vehicle currentLocation -> "unknow"
                        const updateVehicleLocation = await vehicleData.updateVehicleLocationById(vehicle._id, "unknow")
                        if (updateVehicleLocation.success) {
                            const order = await orderData.getOrderByUserId(user._id)
                            res.redirect(`/profile/${user._id}`)
                        } else {
                            const reverseVehicleStatus = await vehicleData.updateVehicleStatuById(vehicle._id, true)
                            if (reverseVehicleStatus.success) {console.log("Reverser: Vehicle inStorage status reversed to true")}
                            const incVehicleModelStorageNum = await modelData.incVehicleInStorageById(vehicleModelId)
                            if (incVehicleModelStorageNum.success) {console.log("Reverser: Vehicle model inStorage number + 1")}
                            res.render("order_error", {
                                msg: "Update vehicle current location unsuccessful.", 
                                id: vehicleModelId
                            })
                            console.log("Update vehicle current location unsuccessful.")
                        }
                    } else {
                        const incVehicleModelStorageNum = await modelData.incVehicleInStorageById(vehicleModelId)
                        if (incVehicleModelStorageNum) {console.log("Reverser: Vehicle model inStorage number + 1")}
                        res.render("order_error", {
                            msg: "Update vehicle inStorage status unsuccessful.", 
                            id: vehicleModelId
                        })
                        console.log("Update vehicle inStorage status unsuccessful.")
                    }
                } else {
                    // const deleteOrder = await orderData.deleteOrderById()

                    res.render("order_error", {
                        msg: "Update vehicle model inStorage number unsuccessful.", 
                        id: vehicleModelId
                    })
                    console.log("Update vehicle model inStorage number unsuccessful.")
                }
            } else {
                res.render("order_error", {
                    msg: "Insert new order unsuccessful.", 
                    id: vehicleModelId
                })
                console.log("Insert new order unsuccessful.")
            }
        } catch (error) {
            res.render("order_error", {
                msg: error, 
                id: req.body.vehicleModelId
            })
            console.log(error)
        }
    } else {
        res.redirect(`/view/${req.session.userName}`)
        console.log("Invalid order request.")
    }
})

module.exports = router;