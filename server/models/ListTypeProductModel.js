const mongoose = require( "mongoose")

const Schema = mongoose.Schema;

const ListTypeProductSchema = new Schema(
  {
    name: String,
    img: String,
    cloudinary_id: String,
  },
  {
    timestamps: true,
  }
);

const ListTypeProductModel = mongoose.model(
  "ListTypeproduct",
  ListTypeProductSchema
);

module.exports = {
    ListTypeProductModel
}