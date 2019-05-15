const uuid = require('uuid')
const models = require('./schemas')
const siteModel = models.getModel('Sites')

async function getAllSites(){
    let result = await siteModel.find({})
    if(result && result.length > 0){
        return {success: true, data: result}
    }
    else{
        return {success: false, desc: `can't find any site.`}
    }
}

async function getSiteById(id) {
    if(typeof id !== 'string'){
        return {success: false, desc: "invalid params"};
    }
    let result = await siteModel.findOne({_id: id});
    if(result){
        return {success: true, data: result};
    }else{
        return { success : false, desc: `can't find site id ${id} in database`}
    }
}

async function getSiteBySiteName(siteName){
    if(typeof siteName !== 'string'){
        return {success: false, desc: "invalid params"};
    }
    let result = await siteModel.find({"siteName": siteName});
    if(result.length > 0){
        return {success: true, data: result};
    }
    else{
        return {success: false, desc: `can't find site item: ${siteName} in database`};
    }
}

async function getSiteBySiteCity(siteCity){
    if(typeof siteCity !== 'string'){
        return {success: false, desc: "invalid params"};
    }
    let result = await siteModel.find({"siteCity": siteCity});
    if(result.length > 0){
        return {success: true, data: result};
    }
    else{
        return {success: false, desc: `can't find site in city: ${siteCity} in database`};
    }
}

async function getSiteBySiteState(siteState){
    if(typeof siteState !== 'string'){
        return {success: false, desc: "invalid params"};
    }
    let result = await siteModel.find({"siteState": siteState});
    if(result.length > 0){
        return {success: true, data: result};
    }
    else{
        return {success: false, desc: `can't find site in state: ${siteState} in database`};
    }
}

async function getSiteBySiteType(siteType){
    if(typeof siteType !== 'string'){
        return {success: false, desc: "invalid params"};
    }
    let result = await siteModel.find({"siteType": siteType});
    if(result.length > 0){
        return {success: true, data: result};
    }
    else{
        return {success: false, desc: `can't find site type: ${siteType} in database`};
    }
}

async function addSite(data) {
    if(data === undefined){
        return {success: false, desc: "No site data received at server."}
    }
    if(data.siteName === undefined){
        return {success: false, desc: "No site received at server."}
    }
    if(data.siteCity === undefined){
        return {success: false, desc: "No site city received at server."}
    }
    if(data.siteState === undefined){
        return {success: false, desc: "No site state received at server."}
    }
    if(data.siteType === undefined){
        return {success: false, desc: "No site type received at server."}
    }

    let info = await getSiteBySiteName(data.siteName)
    if (info.success) {
        return {success: false, desc: "Site already exist."}
    } else {
        let newSite = await new siteModel({
            "_id": uuid.v4(),
            "siteName": data.siteName, 
            "siteCity": data.siteCity, 
            "siteState": data.siteState, 
            "siteType": data.siteType, 
        })
        
        try{
            await newSite.save()
            return {success: true, data: newSite}
        }catch(err){
            return {success: false, desc: err}
        }
    }
}

module.exports = {
    getAllSites, 
    getSiteById, 
    getSiteBySiteName, 
    getSiteBySiteCity, 
    getSiteBySiteState, 
    getSiteBySiteType, 
    addSite
}