const mongoose = require("mongoose");
const service = require("./service");

  const serviceSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    shopname: {
      type: String,
    },
    ourprice: {
      type: Number,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    FinalPrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    active: {
      type: String,
      default: "true",
    },
    availableTimes: {
      type: [String],
    },
    minorderquantity: {
      type: Number,
    },
    packof: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model("Product", serviceSchema);
