import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter.js';
import * as _ from "lodash";

const schema = new mongoose.Schema({
    name: {type: String},
    cost: {type: Number},
}, {
    collection: 'section'
});
schema.plugin(uniqueValidator);

const model = mongoose.model('section', schema);

async function query() {
  return await model.find({});
}
async function queryId(id) {
  return await model.findById(id);
}


async function nameExists(name){
    return await model.exists({name: name});
}

async function idExists(id){
    return await model.exists({_id: id});
}

async function insert(data) {
    return await model.create({name:data.name, cost:data.cost});
}
async function update(data) {
    await model.findByIdAndUpdate(data.sectionID, {name:data.name, cost:data.cost});
    return await model.findById(data.sectionID);
}


async function remove(sectionID){
    return await model.findByIdAndDelete(sectionID);
}

export default {
    query: query,
    queryId: queryId,
    nameExists: nameExists,
    idExists: idExists,
    insert: insert,
    update: update,
    remove: remove,

    model: model,
};
