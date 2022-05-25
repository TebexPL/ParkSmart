import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter.js';
import * as _ from "lodash";

const schema = new mongoose.Schema({
    login: {type: String},
    password: {type: String},
}, {
    collection: 'user'
});
schema.plugin(uniqueValidator);

const model = mongoose.model('user', schema);

  async function nameExists(name){
    return await model.exists({name: name});
  }

  async function idExists(id){
    return await model.exists({id: id});
  }

  async function queryName(name){
    return await model.findOne({name: name});
  }



export default {
    nameExists: nameExists,
    queryName:queryName,
    model: model,
};
