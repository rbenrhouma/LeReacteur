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
    price: {
      type: Number,
      default: 0,
      min: [0, "Should not be negative"]
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    averageRating: { type: Number, min: 0, max: 5 }
  },
  { versionKey: false }
);

const Product = mongoose.model("Product", schema);

module.exports = Product;
