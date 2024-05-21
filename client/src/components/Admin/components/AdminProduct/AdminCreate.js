import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import {
  editCurrentPage,
  saveProduct,
} from "../../../../actions/ProductAction";
import { useHistory } from "react-router-dom";
import { getAllSelectList } from "../../../../actions/SelectListAction";
import { getAllTypeProduct } from "../../../../actions/ListTypeProductAction";
import { LoadingOutlined } from "@ant-design/icons"
import "./AdminProduct.css";


function AdminCreate(props) {
  const { register, handleSubmit } = useForm({ defaultValues: {} });
  const dispatch = useDispatch();
  const history = useHistory();

  const [image, setImage] = useState("");
  const [activeTypeProduct, setActiveTypeproduct] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [loading, setLoading] = useState(false);

  const SelectList = useSelector(state => state.selectList.List)
  const { pages } = useSelector((state) => state.allProduct.product);
  const { List } = useSelector((state) => state.allTypeProduct);

  useEffect(() => {
    dispatch(getAllSelectList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTypeProduct());
  }, [dispatch]);

  const handleFileImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("amount", data.amount);
    formData.append("salePrice", data.salePrice);
    formData.append("type", activeTypeProduct);
    formData.append("image", image);

    Object.entries(selectedOptions).forEach(([key, value]) => {
      formData.append(key, value)
    });

    await dispatch(saveProduct(formData));
    await dispatch(editCurrentPage(pages));
    setLoading(false);
    history.push("/admin/product");
  };

  const MenuFirmProduct = (item) => (
    <div
      className={
        activeTypeProduct === item.name
          ? `filter-menu-firm-item active`
          : "filter-menu-firm-item"
      }
      onClick={() => HandleFilterProductByType(item.name)}
    >
      <img src={item.img}></img>
    </div>
  );

  const HandleFilterProductByType = (name) => {
    setActiveTypeproduct(name);
  };

  const handleOptionChange = (property, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [property]: value
    });
  }

  return (
    <div>
    {loading ? (
      <div className="loading-create">
        <span><LoadingOutlined></LoadingOutlined></span>
      </div>
    ) : (
    <div className="admin-create">
      <span>Create Product</span>
      <form
      className="admin-create-product"
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      >
        <input {...register("name")} placeholder="Name"></input>
        <input
          {...register("amount")}
          placeholder="Amount"
          type="number"
        ></input>
        <input {...register("price")} placeholder="Price" type="number"></input>
        <input
          {...register("salePrice")}
          placeholder="SalePrice"
          type="number"
          ></input>

        <div className="filter-menu-firm">
          {
            List ? (List.map((item) => MenuFirmProduct(item))) : ''
          }
        </div>

        {SelectList && SelectList.length > 0
          ? SelectList.map((item) => (
            <div className="select-type">
                <select {...register(`${item.property}`)} onChange={(e) => handleOptionChange(item.property, e.target.value)}>
                  <option>{item.name}</option>
                  {item.options.map((x) => (
                    <option value={x}>{x}</option>
                  ))}
                </select>
              </div>
            ))
          : ""}

        <input
          type="file"
          {...register("image")}
          onChange={handleFileImageChange}
          ></input>
        <button type="submit">Add Product</button>
      </form>
    </div>
    )}
    </div>
  );
}

export default AdminCreate;
