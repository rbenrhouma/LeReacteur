const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let schema = new Schema(
  {
    title: {
      type: String,
      default: ""
    }
  },
  { versionKey: false }
);

var Department = mongoose.model("Department", schema);

module.exports = Department;
