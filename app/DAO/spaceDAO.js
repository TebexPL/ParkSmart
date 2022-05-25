import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter.js';
import * as _ from "lodash";

const schema = new mongoose.Schema({
    sectionID: {type: mongoose.Schema.ObjectId, ref: 'section'},
    name: {type: String},
    taken: {type: Boolean, default: false},
    since: {type: Date, default: Date.now}

}, {
    collection: 'space'
});
schema.plugin(uniqueValidator);

const model = mongoose.model('space', schema);

async function query() {
  return await model.find({});
}

async function queryInSection(sectionID) {
  return await model.find({sectionID:sectionID});
}

async function queryId(spaceId) {
  return await model.findById(spaceId);
}

async function nameExists(name){
    return await model.exists({name: name});
}

async function nameExistsInSection(name){
    return await model.exists({name: name});
}



async function idExists(id){
    return await model.exists({_id: id});
}

async function updateName(data){
    await model.findByIdAndUpdate(data.spaceID, {name: data.name});
    return await model.findById(data.spaceID);
}

async function updateTaken(data){
    return await model.findByIdAndUpdate(data.spaceID, {taken: data.taken, since: data.since});
}

async function insert(data) {
  return await model.create({sectionID:data.sectionID, name: data.name});
}

async function remove(spaceID) {
  return await model.findByIdAndDelete(spaceID);
}

async function removeInSection(sectionID) {
  return await model.deleteMany({sectionID: sectionID});
}



export default {
    query: query,
    queryInSection: queryInSection,
    queryId: queryId,
    nameExists: nameExists,
    idExists: idExists,
    insert: insert,
    remove: remove,
    removeInSection: removeInSection,
    updateTaken: updateTaken,
    updateName: updateName,

    model: model,
};

/*

*/
