import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import {
  filterProductByPrice,
} from "../../actions/ProductAction";
import { formatPrice } from "../../untils/index";
import FilterMenu from "./FilterMenu/FilterMenu";


function FilterProduct(props) {
  const { setLoading, loading } = props;
  const dispatch = useDispatch();
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  
  const FilterProductByPrice =  (a, b) => {
    setLoading(true);
    let startPrice = parseInt(a);
    let endPrice = parseInt(b);
    console.log(formatPrice(startPrice));
    dispatch(filterProductByPrice(startPrice, endPrice))
    .then(() => setLoading(false))
    .catch(() => setLoading(false));
  };

  

  return (
    <div className="filter">
      <FilterMenu loading={loading} setLoading={setLoading}></FilterMenu>
      
      <div className="options-price">
        <input
          type="number"
          id="priceStart"
          placeholder="đ TỪ"
          onChange={(e) => setStartPrice(e.target.value)}
        ></input>
        <input
          type="number"
          id="priceEnd"
          placeholder="đ ĐẾN"
          onChange={(e) => setEndPrice(e.target.value)}
        ></input>
        <button className="filter-price" onClick={() => FilterProductByPrice(startPrice, endPrice)}>
          Tìm
        </button>
      </div>
    </div>
  );
}

export default FilterProduct;