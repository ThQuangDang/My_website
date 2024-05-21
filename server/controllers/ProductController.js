const {ProductModel} = require( '../models/ProductModel.js')
const expressAsyncHandler = require( 'express-async-handler')
const { PinComment } = require( '../untils/until.js')
const cloudinary = require( 'cloudinary')
const { data } = require( '../data.js')
const { SelectListModel } = require('../models/SelectListModel.js')

const getAllProduct = expressAsyncHandler(async (req, res) => {
    // await ProductModel.remove()
    //const product = await ProductModel.insertMany(data.products)
    // ProductModel.find()
    //     .then(product => res.send(product))
    //     .catch(err => console.log(err))
    const products = await ProductModel.find({ amount: { $gt: 0 } })
    res.send(products)
})

const findProductById = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById({_id: req.params.id})
    
    if(product){
        res.send(product)
    }else{
        res.send({message: 'product not found'})
    }
})

const filterProductByType =  expressAsyncHandler(async (req, res) => {
    // ProductModel.find({type: req.params.type})
    //     .then(product => res.send(product))
    //     .catch(err => console.log(err))

    const filterProductByType = await ProductModel.find({type: req.params.type}).limit(5)
    res.send(filterProductByType)
})

// const filterProductByRandomField = expressAsyncHandler(async (req, res) => {
//     const products = await ProductModel.find(req.body)
//     if(products){
//         res.send(products)
//     }else{
//         res.send({message: 'product not found'})
//     }
// })

const filterProductByRandomField = expressAsyncHandler(async (req, res) => {
    const products = await ProductModel.find({ amount: { $gt: 0 }, ...req.body });
    if(products) {
        res.send(products);
    } else {
        res.status(404).send({ message: 'No products found with amount greater than 0' });
    }
});


const AddProduct = expressAsyncHandler(async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dev_setups",
    });
  
    // Tạo một đối tượng mới từ req.body
    const productFields = {
      name: req.body.name,
      price: req.body.price,
      salePrice: req.body.salePrice,
      amount: req.body.amount,
      type: req.body.type || 'iphone',
      image: result.secure_url,
      cloudinary_id: result.public_id,
      rating: 0,
    };
  
    try {
      // Lưu sản phẩm mới vào cơ sở dữ liệu
      const product = new ProductModel(productFields);
      const newProduct = await product.save();
  
      // Lấy ID của sản phẩm mới được tạo ra
      const newProductId = newProduct._id;
  
      // Tạo một đối tượng chứa các trường cần cập nhật
      const fieldsToUpdate = {};
      Object.keys(req.body).forEach(field => {
        if (!['name', 'price', 'salePrice', 'amount', 'type'].includes(field)) {
          fieldsToUpdate[field] = req.body[field];
        }
      });
  
      // Nếu có các trường cần cập nhật, thực hiện cập nhật cho document mới tạo ra
      if (Object.keys(fieldsToUpdate).length > 0) {
        await ProductModel.updateOne({ _id: newProductId }, { $set: fieldsToUpdate });
      }
  
      return res.status(201).send({ message: "New Product Created", data: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send({ message: "Error adding product" });
    }
  });
  

const UpdateProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.body._id);
  
    if (!product) {
      return res.status(400).send("Product not found");
    }
  
    let result;
    if (req.file.path) { 
    if (product.cloudinary_id) { 
      await cloudinary.uploader.destroy(product.cloudinary_id);
    }
    result = await cloudinary.uploader.upload(req.file.path);
    product.image = result.secure_url;
    product.cloudinary_id = result.public_id;
    }
  
    product.name = req.body.name;
    product.amount = req.body.amount;
    product.price = req.body.price;
    product.salePrice = req.body.salePrice;
    product.type = req.body.type;
    product.rating = 0;
  
    const fieldsToUpdate = {};
    Object.keys(req.body).forEach(field => {
      if (!['name', 'price', 'salePrice', 'amount', 'type', 'qty'].includes(field)) {
        fieldsToUpdate[field] = req.body[field];
      }
    });
  
    if (Object.keys(fieldsToUpdate).length > 0) {
      await ProductModel.updateOne({ _id: req.body._id }, { $set: fieldsToUpdate });
    }
  
    const updateProduct = await product.save();
    if (updateProduct) {
      return res.status(200).send("Update success");
    }
  
    return res.status(400).send("Update fail");
  });
  

const DeleteProduct = expressAsyncHandler(async (req, res) => {
    const deleteProduct = await ProductModel.findById(req.params.id);

    if (!deleteProduct) {
        return res.send({ message: 'Product not found' });
    }

    try {
        await cloudinary.uploader.destroy(deleteProduct.cloudinary_id);
        await ProductModel.deleteOne({ _id: req.params.id });
        res.send({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


const SearchProduct = expressAsyncHandler(async (req, res) => {
    const name = req.query.name
    const product = await ProductModel.find({name: {$regex: name, $options: 'i'}})
    
    product.length > 0 ? res.send(product) : res.send({message: ' khong tim thay sp'})
})


const paginationProduct = expressAsyncHandler(async (req, res) => {
    const perPage = 4;
    const page = req.params.page || 1;

    try {
        const products = await ProductModel.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();

        const count = await ProductModel.countDocuments();

        res.send({
            products: products,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (err) {
        // Xử lý lỗi ở đây
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


const RateProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const existsUser = product.reviews.find(x => x.name === req.body.name)
        if(existsUser){
            res.send({message: 'ban da danh gia san pham nay'})
        }else{
            product.reviews.push(req.body)
            const updateProduct = await product.save()
            res.send(updateProduct)
        }
        
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

const CommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        product.comments.push(req.body)
        const updateCommentProduct = await product.save()
        res.send(updateCommentProduct)
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

const RepCommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const indexComment = product.comments.findIndex(item => item._id == req.body.idComment)
        product.comments[indexComment].replies.push(req.body)

        await product.save()
        res.send(product)
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

const PinCommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const indexComment = product.comments.findIndex(item => item._id == req.body.idComment)
        product.comments[indexComment] = req.body
        PinComment(product.comments, indexComment, 0)

        await product.save()
        res.send(product)
    }else{
        res.status(400).send({message: 'product not found'})
    }
})

const BlogProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById({_id: req.params.id})
    
    if(product){
        product.blog = req.body.blogContent
        await product.save()
        res.send(product)
    }else{
        res.send({message: 'product not found'})
    }
})

const MinusAmountProduct = expressAsyncHandler(async (req, res) => {
    const { products } = req.body;

    for (const item of products) {
        const product = await ProductModel.findById(item._id);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const newAmount = parseInt(product.amount) - parseInt(item.qty);

        await ProductModel.findByIdAndUpdate(
            { _id: item._id },
            { amount: newAmount },
            { new: true }
        );
    }
    res.send({message: 'Amount updated successfully'})
})

const AddAmountProduct = expressAsyncHandler(async (req, res) => {
    const { products } = req.body;

    for (const item of products) {
        const product = await ProductModel.findById(item._id);

        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        const newAmount = parseInt(product.amount) + parseInt(item.qty);

        await ProductModel.findByIdAndUpdate(
            item._id,
            { amount: newAmount },
            { new: true }
        );
    }

    res.send({ message: 'Amount updated successfully' });
});


module.exports = {
    BlogProduct,
    PinCommentProduct,
    RepCommentProduct,
    CommentProduct,
    RateProduct,
    paginationProduct,
    SearchProduct,
    DeleteProduct,
    UpdateProduct,
    AddProduct,
    filterProductByRandomField,
    filterProductByType,
    findProductById,
    getAllProduct,
    MinusAmountProduct,
    AddAmountProduct
}
