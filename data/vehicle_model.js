"use strict";
const uuid = require('uuid')
const models = require('./schemas')
const vehicleModel = models.getModel('VehicleModels')

async function getVehicleModelById(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await vehicleModel.findOne({_id:id})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find vehicle model id: ${id} in database`}
    }
}

/* getVehicleByModels
async function getVehicleByModels(vModels){
    if(typeof vModels !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await vehicleModel.findOne({'vehicleModel': vModels})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find ${vModels} in database`}
    }
} */ 

async function addVehicleModels(data){
    if(typeof data === "undefined" || typeof data == "null"){
        return { success : false, desc: "invalid params 111"}
    }
    if(typeof data.vehicleModel === "undefined" || 
        typeof data.vehicleType === "undefined" ||
        typeof data.passengers === "undefined" ||
        typeof data.auto === "undefined" ||
        typeof data.ac === "undefined" || 
        typeof data.dailyCharge === "undefined" ||
        typeof data.totalStorage === "undefined" ||
        typeof data.inStorage === "undefined" ){
        return { success : false, desc: "invalid params 222"}
    }

    let newVechileModel = await new vehicleModel({
        "_id": uuid.v4(), 
        "vehicleModel": data.vehicleModel, 
        "vehicleType": data.vehicleType, 
        "passengers": data.passengers, 
        "auto": data.auto,
        "ac": data.ac, 
        "dailyCharge": data.dailyCharge, 
        "totalStorage": data.totalStorage, 
        "inStorage": data.inStorage
    })
    try{
        await newVechileModel.save()
        return {success: true, data: newVechileModel}
    }catch(err){
        return {success: false, data: err}
    }
}

async function updateVehicleTotalbyId(id, num){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await vehicleModel.updateOne({
        '_id': id 
    },{
        '$set':{
            'totalStorage': num
        }
    })
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't find vehicle model id: ${id} in database`}
    }
}

async function updateVehicleInStoragebyId(id, num){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await vehicleModel.updateOne({
        '_id': id 
    },{
        '$set':{
            'inStorage': num
        }
    })
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't find vehicle model id: ${id} in database`}
    }
}

module.exports = {
    getVehicleModelById,
    // getVehicleByModels, 
    addVehicleModels, 
    updateVehicleTotalbyId, 
    updateVehicleInStoragebyId
}