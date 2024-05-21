import React from 'react';
import Product from './Product'
import { LoadingOutlined } from '@ant-design/icons'
 
function ListProduct(props) {
    const {HotSaleProducts, loading} = props;

    return (
        <>
        {loading ? (
            <div className="loading-myorder">
                <span><LoadingOutlined></LoadingOutlined></span>
            </div>
        ) : (
            <div className="hotsale-listproduct">
            {
                HotSaleProducts.map((product, index) => (
                    <Product product={product} key={index}></Product>
                ))
            }
        </div>
        )}
        </>
    );
}

export default ListProduct;