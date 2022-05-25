import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import * as _ from "lodash";


const schema = new mongoose.Schema({
      sectionID: {type: mongoose.Schema.ObjectId, ref: 'section'},
      spaceID: {type: mongoose.Schema.ObjectId, ref: 'space'},
      since: {type: Date},
      to: {type: Date},
      cost: {type: Number}
}, {
    collection: 'history'
});
schema.plugin(uniqueValidator);


const model = mongoose.model('history', schema);

async function query() {
  return await model.find({});
}

async function insert(data){
  return await model.create(data);
}

async function clear(){
  return await model.deleteMany({});
}


export default {
    query: query,
    insert: insert,
    clear: clear,
    model: model
};
