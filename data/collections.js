const dbConnection = require("./connections")

const getCollection = collection => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    }
}

module.exports = {
    users: getCollection("users"), 
    models: getCollection("models"), 
    sites: getCollection("sites"), 
    vehicles: getCollection("vehicles"), 
    orders: getCollection("orders")
}