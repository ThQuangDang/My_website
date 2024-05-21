import React from 'react';
import {formatPrice} from '../../untils/index'
import { useDispatch } from 'react-redux'
import {AddToCart, DeleteToCart, DeleteQtyProduct} from '../../actions/CartAction'
Product.propTypes = {

};

function Product(props) {
    const { product } = props
    const dispatch = useDispatch()

    function handleDeleteProduct(product) {
        const action = DeleteToCart(product)
        dispatch(action);
    }

    function handleAddProduct(product) {
        if (product.qty >= product.amount) {
            alert('Số lượng sản phẩm trong giỏ hàng đã vượt quá số lượng trong kho');
            return;
        }
        const action = AddToCart(product);
        dispatch(action);
    }

    function handleProductOut(product) {
        const action =  DeleteQtyProduct(product)
        dispatch(action)
    }

    const lowStockMessage = product.amount < 5 ? 'Lượng hàng trong kho thấp' : '';

    return (
        <div className="shopping-cart-list-product">
            <div className="shopping-cart-list-product-block">
                <div className='product-lock-stock'>
                    <div className='product-low-stock'>
                        <div className="shopping-cart-list-product-block-left">
                            <img src={product.image}></img>
                        </div>
                        <div className="shopping-cart-list-product-block-right">
                            <p className="product-name">
                                {product.name}
                            </p>
                            <p className="product-price">
                                {formatPrice(product.salePrice)}
                            </p>
                        </div>
                    </div>
                        {lowStockMessage && <p className="low-stock-message">{lowStockMessage}</p>}
                </div>
                <div className="shopping-cart-list-product-bottom">
                    <ul className="button-event">
                        <li onClick={() => handleDeleteProduct(product)}>-</li>
                        <li>{product.qty}</li>
                        <li onClick={() => handleAddProduct(product)}>+</li>
                    </ul>
                    <button className="delete-product" onClick={() => handleProductOut(product)}> Xóa khỏi giỏ hàng </button>
                </div>
            </div>
        </div>
    );
}

export default Product;