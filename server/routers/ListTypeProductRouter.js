const express = require("express")
const {
  createNewTypeProduct,
  deleteTypeProduct,
  getAllTypeProduct,
} = require("../controllers/ListTypeProductController.js")
const  {upload} = require("../untils/until.js")

const ListTypeProductRouter = express.Router();

ListTypeProductRouter.get("/", getAllTypeProduct);
ListTypeProductRouter.post(
  "/create",
  upload.single("image"),
  createNewTypeProduct
);
ListTypeProductRouter.delete(
  "/delete/:id",
  deleteTypeProduct
);

module.exports = ListTypeProductRouter
