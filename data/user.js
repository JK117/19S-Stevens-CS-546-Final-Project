const uuid = require('uuid')
const models = require('./schemas')
const userModel = models.getModel('Users')

async function getUserById(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await userModel.findOne({_id:id})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find user id: ${id} in database`}
    }
}

async function getUserByUserName(username){
    if(typeof username !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await userModel.findOne({'userName': username})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find user name: ${username} in database`}
    }
}

async function getUserBySessionId(sessionid){
    if(typeof sessionid !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await userModel.findOne({'sessionId': sessionid})
    if( result ){
        return { success : true, data: result}
    }else{
        return { success : false, desc: `can't find user session: ${sessionid} in database`}
    }
}

async function deleteSessionId(sessionid){
    if(typeof sessionid !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await userModel.updateOne( {
        'sessionId':sessionid}, {
            '$set':{
                'sessionId': undefined
    }})

    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't find user session: ${sessionid} in database`}
    }
}

async function addSessionIdById(id, newSessionId){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result =  await userModel.updateOne({
        '_id':id},{
            '$set':{
                'sessionId': newSessionId
    }})
    if(result.n > 0){
        return { success : true , data : newSessionId}
    }else{
        return { success : false, desc: `can't find ${id} in database`}
    }
}

/* updateUserProfilebyId, updateHasedPwdByID, addRecordById, getRecordByRecordId 
async function updateUserProfilebyId(id, profile){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
    let result = await userModel.updateOne({
        '_id': id 
    },{
        '$set':{
            'profile':{
                'firstName' : profile.firstName,
                'lastName': profile.lastName,
                'email' : profile.email,
                'hashedPwd' : profile.hashedPwd,
                'avatarUrl' : profile.avatarUrl                
            }
        }
    })
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't find ${id} in database`}
    }
}

async function updateHashedPwdById(id, newHashedPwd){
    if(typeof id !== 'string' || typeof newHashedPwd === "undefined" || typeof newHashedPwd == "null"){
        return { success : false, desc: "invalid params"}
    }
    let result = await userModel.updateOne({'_id':id},{'$set':{
        'hashedPwd':newHashedPwd
    }})
    if(result.n > 0){
        return { success : true , data : result.nModified}
    }else{
        return { success : false, desc: `can't find ${id} in database`}
    }
}

async function addRecordById(id, data){
    if(typeof id !== 'string' || typeof data === "undefined" || typeof data == "null"){
        return { success : false, desc: "invalid params"}
    }
    if(typeof data.bookid === "undefined" || typeof data.time == "undefined" ||typeof data.action == "undefined" ||typeof data.staffid == "undefined"  ){
        return { success : false, desc: "invalid params"}
    }
    let newRecordId = uuid.v4();
    let result = await userModel.updateOne({'_id':id},{'$addToSet':{
        'record':{
            '_id' : newRecordId,
            'bookid' : data.bookid,
            'time' : data.time,
            'action' : data.action,
            'staffid' : data.staffid,
        }
    }})
    if(result.n > 0){
        return { success : true , data : await getRecordByRecordId(newRecordId)}
    }else{
        return { success : false, desc: `can't find ${id} in database`}
    }
} 

async function getRecordByRecordId(id){
    if(typeof id !== 'string'){
        return { success : false, desc: "invalid params"}
    }
     
    let result = await userModel.findOne({'record._id':id})
    
    if( result ){
        let data;
        result.record.forEach(element => {
            if(element._id == id){
                data =  element
            }
        });
        return { success : true, data: data}
    }else{
        return { success : false, desc: `can't find ${id} in database`}
    }
} */ 

async function addUser(data){
    if(typeof data === "undefined" || typeof data == "null"){
        return { success : false, desc: "invalid params 111"}
    }
    if(typeof data.userName === "undefined" || 
        typeof data.firstName === "undefined" ||
        typeof data.lastName === "undefined" ||
        typeof data.email === "undefined" ||
        typeof data.hashedPwd === "undefined" || 
        typeof data.staff === "undefined"){
        return { success : false, desc: "invalid params 222"}
    }
    let newUser = await new userModel({
        "_id": uuid.v4(), 
        "sessionId": data.sessionId,
        "userName": data.userName,
        "firstName": data.firstName,
        "lastName": data.lastName, 
        "email": data.email, 
        "hashedPwd": data.hashedPwd, 
        "avatarUrl": data.avatarUrl, 
        "staff": data.staff
    })
    try{
        await newUser.save()
        return {success: true, data: newUser}
    }catch(err){
        return {success: false, data: err}
    }
}


module.exports = {
    getUserById,
    getUserByUserName,
    getUserBySessionId,
    deleteSessionId,
    addSessionIdById,
    addUser
    // updateUserProfilebyId,
    // updateHashedPwdById,
    // addRecordById,
    // getRecordByRecordId
}