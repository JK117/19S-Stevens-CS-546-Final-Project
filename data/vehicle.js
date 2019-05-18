"use strict";
const uuid = require('uuid')
const models = require('./schemas')
const carModel = models.getModel('Vehicles')
const siteModel = models.getModel('Sites')

async function getVehicleById(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await carModel.findOne({_id:id})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find vehicle id: ${id} in database`}
    }
}

async function addVehicle(data){
    if(typeof data === "undefined" || typeof data == "null"){
        return { success : false, desc: "invalid params 111"}
    }
    if(typeof data.vehicleModel === "undefined" || 
        typeof data.license === "undefined" ||
        typeof data.inStorage === "undefined" ||
        typeof data.currentLocation === "undefined"){
        return { success : false, desc: "invalid params 222"}
    }
    let newVechile = await new carModel({
        "_id": uuid.v4(), 
        "vehicleModel": data.vehicleModel, 
        "license": data.license, 
        "inStorage": data.inStorage, 
        "currentLocation": data.currentLocation,
    })
    try{
        await newVechile.save()
        return {success: true, data: newVechile}
    }catch(err){
        return {success: false, data: err}
    }
}

async function updateVehicleStatuById(id, status){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await carModel.updateOne({
        '_id': id 
    },{
        '$set':{
            'inStorage': status
        }
    })
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't update vehicle status on id: ${id} in database`}
    }
}

async function updateVehicleLocationById(id, loc){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await carModel.updateOne({
        '_id': id 
    },{
        '$set':{
            'currentLocation': loc
        }
    })
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't update vehicle location on id: ${id} in database`}
    }
}

async function getVehicleByModel(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await carModel.findOne({vehicleModel: id})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find the vehicle moodel ${id} in database`}
    }
}

async function getVehicleBySiteAndModelAndStatus(siteName, vehicleModel){
    if(typeof siteName !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    if(typeof vehicleModel !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await carModel.find({currentLocation:siteName, vehicleModel:vehicleModel, inStorage:true})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find the vehicle model ${vehicleModel} in database`}
    }
}

async function getVehicleBySite(siteName){
    if(typeof siteName !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await carModel.find({currentLocation: siteName})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find the vehicle moodel ${id} in database`}
    }
}

module.exports = {
    getVehicleById, 
    addVehicle, 
    updateVehicleStatuById, 
    updateVehicleLocationById, 
    getVehicleByModel, 
    getVehicleBySiteAndModelAndStatus, 
    getVehicleBySite
}