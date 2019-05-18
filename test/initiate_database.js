const fs = require("fs")
const userData = require("../data/user")
const vehicleModelData = require("../data/vehicle_model")
const siteData = require("../data/site")
const vehicleData = require("../data/vehicle")

async function getDataFile(fileDirc){
    let data = JSON.parse(fs.readFileSync(fileDirc))
    // console.log(data)
    return data
}

async function addUsers(){
    let userList = await getDataFile("./users.json"); 
    let userData = data.user; 

    for (let i = 0; i < userList.length; i ++){
        try {
            await userData.addUser(userList[i]); 
        } catch (e) {
            console.log(e); 
        }
    }
}

async function addVehicleModels(){
    let vehicleModelList = await getDataFile("./vehicle_models.json"); 
    // let vehicleModelData = data.vehicle_model; 

    for (let i = 0; i < vehicleModelList.length; i ++){
        try {
            await vehicleModelData.addVehicleModels(vehicleModelList[i]); 
        } catch (e) {
            console.log(e); 
        }
    }
}

async function addSites(){
    let siteList = await getDataFile("./sites.json"); 
    // let siteData = data.site; 

    for (let i = 0; i < siteList.length; i ++){
        try {
            await siteData.addSite(siteList[i]); 
        } catch (e) {
            console.log(e); 
        }
    }
}

async function addVehicle(){
    let vehicleList = await getDataFile("./vehicles.json"); 
    // let vehicleData = data.vehicle; 

    for (let i = 0; i < vehicleList.length; i ++){
        try {
            await vehicleData.addVehicle(vehicleList[i]); 
        } catch (e) {
            console.log(e); 
        }
    }
}

// module.exports = {
//     addUsers, 
//     addVehicleModels,
//     addSites, 
//     addVehicle
// }

addSites()
addVehicleModels()
addVehicle()