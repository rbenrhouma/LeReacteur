const mongoose = require("mongoose");
var Schema = mongoose.Schema;

let schema = new Schema(
  {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department"
    }
  },
  { versionKey: false }
);

const Category = mongoose.model("Category", schema);

module.exports = Category;
