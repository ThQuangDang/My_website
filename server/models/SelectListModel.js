const mongoose = require("mongoose")

const Schema = mongoose.Schema

const SelectList = new Schema(
  {
    name: String,
    property: String,
    options: Array,
  },
  {
    timestamp: true,
  }
);

const SelectListModel = mongoose.model("SelectList", SelectList);

module.exports = {
    SelectListModel
}