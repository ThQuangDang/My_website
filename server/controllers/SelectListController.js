const expressAsyncHandler = require( "express-async-handler")
const { SelectListModel } = require( "../models/SelectListModel.js")
const { ProductModel } = require( "../models/ProductModel.js")


// const createOptionByproperty = expressAsyncHandler(async (req, res) => {
//   const SelectListItem = new SelectListModel({
//     name: req.body.name,
//     property: req.body.property,
//     options: req.body.options,
//   });

//   await SelectListItem.save();

//   const selectListProperty = req.body.property;
//   const productSchema = ProductModel.schema;
  
//   if (!productSchema.path(selectListProperty)) {
//     ProductModel.schema.add({ [selectListProperty]: Object });
//   }
//   console.log(ProductModel.schema.obj);

//   res.send(SelectListItem);
// });

const createOptionByproperty = expressAsyncHandler(async (req, res) => {
  try {
    // Tạo một document mới trong SelectListModel
    const SelectListItem = new SelectListModel({
      name: req.body.name,
      property: req.body.property,
      options: req.body.options,
    });

    await SelectListItem.save();

    //Tạo một trường mới trong schema của ProductModel nếu không tồn tại
    // const result = await ProductModel.updateMany(
    //   {},
    //   { $set: { [req.body.property]: req.body.property } },
    //   { //options
    //     returnNewDocument: true,
    //     new: true,
    //     strict: false
    //   }
    // );

    // console.log(result)

    res.send(SelectListItem);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});



const getAllOptionByproperty = expressAsyncHandler(async (req, res) => {
  const SelectList = await SelectListModel.find({});
  if (SelectList) {
    res.send(SelectList);
  } else {
    res.send({ error: "no select list" });
  }
});

const UpdateSelectOption = expressAsyncHandler(async (req, res) => {
  const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
  if (UpdateSelect) {
    UpdateSelect.name = req.body.name;
    UpdateSelect.property = req.body.property;
    UpdateSelect.options = req.body.options;
  }

  await UpdateSelect.save();
  res.send(UpdateSelect);
});

const getSelectOptionById = expressAsyncHandler(async (req, res) => {
  const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
  if (UpdateSelect) {
    res.send(UpdateSelect);
  } else {
    res.send({ message: "no select " });
  }
});

// const deleteSelectOption = expressAsyncHandler(async (req, res) => {
//   const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
//   await UpdateSelect.remove();

//   res.send({ msg: "deleted select" });
// });

const deleteSelectOption = expressAsyncHandler(async (req, res) => {
  const selectOption = await SelectListModel.findById(req.params.id);
  
  if (!selectOption) {
    return res.send({ msg: 'Select option not found' });
  }

  try {
    await SelectListModel.deleteOne({ _id: req.params.id });
    res.send({ msg: 'Deleted select' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});


module.exports = {
    deleteSelectOption,
    getAllOptionByproperty,
    getSelectOptionById,
    UpdateSelectOption,
    createOptionByproperty
}
