const mongoose = require('mongoose')
const config = require('./db_config')
const DB_URL = config.serverUrl + config.database

mongoose.connect(DB_URL, {
    useNewUrlParser: true 
}, (err) => {
    if (err) {
        console.warn('Cannot connected to database! ' + err)
    } else {
        console.log('Connected to datbase: ' + DB_URL)
    }
})

const userSchema =  mongoose.Schema({
    _id:{type : String, 'require':true}, 
    sessionId : String, 
    userName : {type:String, 'require':true}, 
    firstName: {type:String, 'require':true}, 
    lastName: {type:String, 'require':true}, 
    email: {type:String, 'require':true}, 
    hashedPwd :{type:String, 'require':true}, 
    avatarUrl: String, 
    staff: {type:Boolean, 'require':true}
}) 

const vehicleModelSchema = mongoose.Schema({
    _id: {type:String, 'require':true}, 
    vehicleModel: {type:String, 'require':true}, 
    vehicleType: {type:String, 'require':true}, 
    passengers: {type:Number, 'require':true}, 
    auto: {type:Boolean, 'require':true}, 
    ac: Boolean, 
    dailyCharge: {type:Number, 'require':true}, 
    totalStorage: {type:Number, 'require':true}, 
    inStorage: {type:Number, 'require':true}
})

const siteSchema = mongoose.Schema({
    _id: {type:String, 'require':true}, 
    site: {type:String, 'require':true}, 
    siteCity: {type:String, 'require':true}, 
    siteState: {type:String, 'require':true}, 
    siteType: {type:String, 'require':true}, 
})

const vehicleSchema = mongoose.Schema({
    _id: {type:String, 'require':true}, 
    vehicleModel: {type:String, 'require':true}, 
    license: {type:String, 'require':true}, 
    inStorage: {type:Boolean, 'require':true}, 
    currentLocation: String
})

const orderSchema = mongoose.Schema({
    _id: {type:String, 'require':true}, 
    userId: {type:String, 'require':true}, 
    vehicleId: {type:String, 'require':true}, 
    from: {type:String, 'require':true}, 
    to: {type:String, 'require':true}, 
    pickUpDate: {type:String, 'require':true}, 
    dropOffDate: {type:String, 'require':true}, 
    totalCharge: {type:Number, 'require':true}
})

mongoose.model('Users', userSchema)
mongoose.model('VehicleModels', vehicleModelSchema)
mongoose.model('Sites', siteSchema)
mongoose.model('Vehicles', vehicleSchema)
mongoose.model('Orders', orderSchema)

module.exports = {
    getModel:function(name){
        return mongoose.model(name)
    }
}