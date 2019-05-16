const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const modelData = require("../data/vehicle_models")

router.get("/vehicle_models", async (req, res) => {
    try{
        const models = await modelData.getAllVehicleModels();
        res.render("allModels", {models: models}); 
    } catch(err){
        console.log(err)
    }
})