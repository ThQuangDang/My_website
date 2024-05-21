import React, { useEffect, useState } from 'react';
import ListProduct from './ListProduct'
import './Sale.css'
import {handlePercentDiscount} from '../../untils/index'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct} from '../../actions/ProductAction';

import FilterProduct from './FilterProduct';
import SortByPrice from './SortByPrice/SortByPrice';
import { LoadingOutlined } from '@ant-design/icons'


function AllProduct(props) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    
    const product = useSelector(state => state.allProduct.product)

    useEffect(() => {
        setLoading(true);
        dispatch(getAllProduct())
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
    }, [dispatch])

    return (
        <section id="hotsale iphone">
            <div className="hotsale">
                <FilterProduct setLoading={setLoading} loading={loading}></FilterProduct>
                <SortByPrice setLoading={setLoading} loading={loading}></SortByPrice>
                {loading ? (
                    <div className="loading-myorder">
                        <span><LoadingOutlined></LoadingOutlined></span>
                    </div>
                ) : (
                    <div>
                    {
                        product && product.length > 0 ? (<ListProduct HotSaleProducts={handlePercentDiscount(product)} loading={loading}></ListProduct>) : (<span>Không có sản phẩm</span>)
                    }
                    </div>    
                )}
            </div>
        </section>

    );
}


export default AllProduct;