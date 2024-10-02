const mongoose = require("mongoose");

const options = {
  type: String,
  require: true,
};
const autoFault = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    unique: true,
  },
  description: options,
  possibleCauses: [options],
  suggestedFixes: [options],
});
module.exports = mongoose.model("new_codes", autoFault);
