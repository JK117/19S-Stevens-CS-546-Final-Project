"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const data = require("../data");
const modelData = require("../data/vehicle_models");
const vehicleData = require("../data/vehicles"); 
const siteData = require("../data/sites"); 
const orderData = require("../data/order");
const userData = require("../data/user");

// Get vehicle model information 
router.get("/:id", async(req, res) => {
    try{
        const model = await modelData.getVehicleModelById(Number(req.params.id)); 
        res.render("detail", {
            detail: model
        })
    } catch (e) {
        res.status(404).render("error", {
            title: "Cannot find the vehicle model", 
            error: e
        })
    }
});

// Post a new order 
router.post("/:id", async (req, res) => {
    const orderDetail = req.body;
    try {
        // Total Charges
        const days = orderDetail.dropOffDate - orderDetail.pickUpDate; 
        const total = days * model.dailyCharge; 

        // Get vehicle ID
        const siteInfo = await siteData.getSiteBySiteName(orderData.from); 
        const siteId = siteInfo._id; 
    
        const carList = await vehicleData.getVehicleByModel(Number(req.params.id));
        for (let i = 0; i < carList.length; i ++){
            let location = carList[i].currentLocation;
            if (location != siteId){
                carList = carList.removeOne({currentLocation: location});
            }
        }

        if (carList.length === 0) {
            throw `The picked vehicle is not availiable in the pick up locaiton`;
        }

        const vehicleId = carList[0]._id;

        // Add the new order 
        const userInfo =  await userData.getUserBySessionId(Number(req.params.sessionId));
        const userId = userInfo._id; 
        const newOrder = await orderData.addOrder({
            "userId": userId, 
            "vehicleId": vehicleId,
            "from": orderData.from,
            "to": orderData.to, 
            "pickUpDate": orderData.pickUpDate,
            "dropOffDate": orderData.dropOffDate,
            "totalCharge": total 
        }); 

        if (newOrder.success === true) {
            // change vehicle table (inStorage, currentLocation) status
            await vehicleData.updateVehicleStatuById(vehicleId, false)
            await vehicleData.updateVehicleLocationById(vehicleId, " "); 

            // Change vehicleModel instorage number
            const modelInfo = await modelData.getVehicleModelById(req.params.id); 
            const currentNum = modelInfo.inStorege; 
            await modelData.updateVehicleInStorageById(Num(req.params.id), currentNum - 1);
            
            res.json({ isAdd: true });
        } else {
            res.json({ isAdd: false });
        }
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

module.exports = router;