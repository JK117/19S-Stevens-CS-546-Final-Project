"use strict";
const uuid = require('uuid')
const models = require('./models')
const orderModel = models.getModel('Order')

async function getOrderById(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await orderModel.findOne({_id:id})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find order ${id} in database`}
    }
}

async function addOrder(data){
    if(typeof data === "undefined" || typeof data == "null"){
        return { success : false, desc: "invalid params 111"}
    }
    if(typeof data.userId === "undefined" || 
        typeof data.vehicleId === "undefined" ||
        typeof data.from === "undefined" ||
        typeof data.to === "undefined" ||
        typeof data.pickUpDate === "undefined" ||
        typeof data.dropOffDate === "undefined" ||
        typeof data.totalCharge === "undefined"){
        return { success : false, desc: "invalid params 222"}
    }
    let newOrder = await new orderModel({
        "_id": uuid.v4(), 
        "userId": data.userId, 
        "vehicleId": data.vehicleId, 
        "from": data.from, 
        "to": data.to,
        "pickUpdate": data.pickUpdate, 
        "dropOffDate": data.dropOffDate, 
        "totalCharge": data.totalCharge,
    })
    try{
        await newOrder.save()
        return {success: true, data: newOrder}
    }catch(err){
        return {success: false, data: err}
    }
}

module.exports = {
    getOrderById, 
    addOrder
}