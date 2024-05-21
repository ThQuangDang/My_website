const express = require('express')
const {
  getAllProduct,
  filterProductByType,
  findProductById,
  AddProduct,
  DeleteProduct,
  CommentProduct,
  UpdateProduct,
  SearchProduct,
  paginationProduct,
  RateProduct,
  RepCommentProduct,
  BlogProduct,
  PinCommentProduct,
  filterProductByRandomField,
  MinusAmountProduct,
  AddAmountProduct,
  CountProducts
} = require("../controllers/ProductController.js")
const { isAuth, isAdmin } = require("../untils/until.js")
const { upload } = require("../untils/until.js")

const ProductRouter = express.Router();

ProductRouter.get("/:type", filterProductByType);
ProductRouter.post("/filter/random", filterProductByRandomField);
ProductRouter.get("/detail/:id", findProductById);
ProductRouter.get("/", getAllProduct);
ProductRouter.get(`/pagination/:page`, paginationProduct);
ProductRouter.post("/minusamount", MinusAmountProduct);
ProductRouter.post("/addamount", AddAmountProduct)

ProductRouter.post("/rate/:id", RateProduct);
ProductRouter.post("/comment/:id", CommentProduct);
ProductRouter.post("/pin/comment/:id", PinCommentProduct);
ProductRouter.post("/rep/comment/:id", RepCommentProduct);

ProductRouter.post(
  "/create",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  AddProduct
);
ProductRouter.put(
  "/update",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  UpdateProduct
);
ProductRouter.post(
  "/blog/:id",
  // isAuth,
  // isAdmin,
  BlogProduct
);
ProductRouter.delete(
  "/delete/:id",
  // isAuth,
  // isAdmin,
  upload.single("image"),
  DeleteProduct
);

ProductRouter.get('/search/product', SearchProduct)

module.exports = ProductRouter