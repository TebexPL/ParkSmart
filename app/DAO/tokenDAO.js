import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoConverter from '../service/mongoConverter.js';
import config from "../config.js";
import jwt from "jsonwebtoken";
import * as _ from "lodash";

const schema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    value: { type: String, required: true },
    createdOn: {type: Date, default: Date.now},
}, {
    collection: 'token'
});
schema.plugin(uniqueValidator);

const model = mongoose.model('token', schema);

  async function create(userID){
      const user = {};
      user.id = userID;

      const value = jwt.sign(
      user,
      config.JwtSecret,
      {
        expiresIn: '3h'
      });
      return await model.create({userID: userID, value: value});
  }

  async function get(value){
      return await model.findOne({value: value});
  }

  async function exists(value){
      return await model.exists({value: value});
  }

  async function remove(value){
      return await model.findOneAndDelete({value: value});
  }



export default {
    create: create,
    get: get,
    remove: remove,
    exists: exists,
    model: model,
};
