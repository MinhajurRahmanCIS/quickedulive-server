const { ObjectId } = require("mongodb");

// Get Function
const getData = async (collection) => {
    const cursor = collection.find();
    const result = await cursor.toArray();
    return result;
};

// Specific Get Function
const getSpecificData = async (id, collection) => {
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);
    return result;
};

// Post Function
const postData = async (collection, data) => {
    const result = await collection.insertOne(data);
    return result;
}

// Update Function
const updateData = async (id, updatedDoc, options, collection) => {
    const filter = { _id: new ObjectId(id) };
    const result = await collection.updateOne(filter, updatedDoc, options);
    return result;
};

// Delete Function
const deleteData = async (id, collection) => {
    const query = { _id: new ObjectId(id) };
    const result = await collection.deleteOne(query);
    return result;
};

module.exports = {
    getData,
    getSpecificData,
    postData,
    updateData,
    deleteData
};