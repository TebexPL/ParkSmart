
import * as _ from 'lodash';

function convert(data) {
  if (Array.isArray(data)) {
    return data.map(function (elem) {
      return convert(elem);
    });
  }
  data = data.toObject({getters: true, versionKey: false});
  delete data._id;
  return data;
}

export default convert;