import React from "react";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  createOrderGhn,
  PrintOrderGhn,
} from "../../../../../actions/GhnAction";
import { deleteOrder, getAllOrder, ShippingOrder } from "../../../../../actions/OrderAction";
import {
  formatPrice,
  formatDateOrderPaypal,
} from "../../../../../untils/index";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons"

function Order(props) {
  const { order } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  console.log(order)

  const {
    orderItems,
    totalPrice,
    paymentMethod,
    cancelOrder,
    shippingAddress,
    status,
    paymentResult,
    user
  } = order;

  useEffect(() => {
    const getEmail = async () => {
      const response = await axios.post("http://localhost:5000/user/find", {
        id: user
      });
      const userData = response.data;
      setEmail(userData.email)
    };

    getEmail();
  }, []);

  const handleShippingOrder = async (order) => {
    setLoading(true);
    await dispatch(createOrderGhn(order._id));
    await dispatch(ShippingOrder(order._id));

    const productsToSend = order.orderItems.map(item => ({
      _id: item._id,
      image: item.image,
      name: item.name
    }));

    await axios.post("http://localhost:5000/send-mail", {
      products: productsToSend,
      item: 'Xác nhận đơn hàng',
      email: email
    })

    dispatch(getAllOrder());
    setLoading(false);
  };

  const handlePrintOrder = (order) => {
    console.log(order);
    dispatch(PrintOrderGhn(order._id));
  };

  const handleDeleteOrder = async (order) => {
    setLoading(true);
    await dispatch(deleteOrder(order._id))

    const productsToSend = order.orderItems.map(item => ({
      _id: item._id,
      image: item.image,
      name: item.name
    }));

    await axios.post("http://localhost:5000/send-mail", {
      products: productsToSend,
      item: 'Hủy đơn',
      email: email
    })

    dispatch(getAllOrder());
    setLoading(false);
  }

  return (
    <>
    {loading ? (
      <div className="loading-order">
        <span><LoadingOutlined></LoadingOutlined></span>
      </div>
    ) : (
      <div className="order-list">
        <div className="order-list-items">
          {orderItems.map((item) => (
            <div className="order-items-item">
              <span className="img">
                <img src={item.image}></img>
              </span>
              <span className="qty">Qty: {item.qty}</span>
              <span className="name">{item.name}</span>
              <span className="price">{formatPrice(item.salePrice)}</span>
            </div>
          ))}
        </div>
        <div className="toatalPrice">
          <span>Tổng tiền: {formatPrice(totalPrice)}</span>
        </div>
        <div className="order-info">
          <div className="order-info-address">
            <b>Địa chỉ : </b> {"  "}
            {shippingAddress.name},{""}
            {shippingAddress.province}, {shippingAddress.district},{"  "}
            {shippingAddress.ward}, {shippingAddress.detail},{" "}
            {shippingAddress.phone}
          </div>
        </div>

        {paymentResult ? (
          <div className="order-payment-check">
            Paid : {formatDateOrderPaypal(paymentResult.update_time)}
          </div>
        ) : (
          ""
        )}

        <div className="order-bottom">
          {status === "shipping" ? (
            <div className="order-status">
              <span>
                Đã xác nhận{" "}
                {paymentMethod === "payOnline" ? (
                  <span>& Đã thanh toán</span>
                ) : (
                  ""
                )}
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="order-button">
            {status === "pendding" && cancelOrder === false ? (
              <>
                <button
                  className="shipping"
                  onClick={() => handleShippingOrder(order)}
                  >
                  Xác nhận đơn hàng
                </button>

              </>
            ) : (''
            )}

            {
              cancelOrder === true ? (<>
              <span> Khách yêu cầu hủy đơn </span>
                <button
                  className="shipping"
                  onClick={() => handleDeleteOrder(order)}
                  >
                  Hủy đơn
                </button>

              </>) : ''
            }

            {status === "shipping" ? (
              <button
              className="shipping"
              onClick={() => handlePrintOrder(order)}
              >
                In đơn hàng
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      )} 
    </>
  );
}

export default Order;
