import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  getOrderPenddingByUser,
} from "../../../../actions/OrderAction";
import axios from "axios";
import { formatPrice } from "../../../../untils/index";
import "./PenddingOrder.css";
import { LoadingOutlined } from "@ant-design/icons"

function PenddingOrder(props) {
  const dispatch = useDispatch();
  const [ loading, setLoading ] = useState(false);
  const { myOrdersPendding } = useSelector((state) => state.orderByUser);
  const { userInfo } = useSelector((state) => state.userSignin);

  const orderParent = (item) => (
    <div className="all-myorder-parent-item">
      <div className="all-myorder-list">
        {item.orderItems.map((item) => orderItem(item))}
      </div>
      <div className="all-myorder-item-totalprice">
        {item.paymentMethod === "payOnline" ? (
          <span>Đã thanh toán : </span>
        ) : (
          <span>Tổng số tiền : </span>
        )}{" "}
        <strong>{formatPrice(item.totalPrice)}đ</strong>
        <div className="myorder-cancel">
          {
            item.cancelOrder ? (<span>Đang yêu cầu hủy đơn</span>) : (<span onClick={() => handleCancelOrder(item)}>Hủy đơn hàng</span>)
          }
        </div>
      </div>
    </div>
  );
  const orderItem = (item) => (
    <div className="all-myorder-item">
      <div className="all-myorder-item-img">
        <img src={item.image}></img>
      </div>
      <div className="all-myorder-item-name">
        <p>{item.name}</p>
        <span>x{item.qty}</span>
      </div>
      <div className="all-myorder-item-price">
        {formatPrice(item.salePrice)}
      </div>
    </div>
  );

  const handleCancelOrder = async (item) => {
    setLoading(true);
    console.log(item);
    await dispatch(cancelOrder(item._id));

    const productsToSend = item.orderItems.map(item => ({
      _id: item._id,
      qty: item.qty,
    }));

    await axios.post("http://localhost:5000/products/addamount", {
      products: productsToSend
    })

    dispatch(getOrderPenddingByUser(userInfo._id));

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getOrderPenddingByUser(userInfo._id));
    setLoading(false);
  }, [dispatch]);

  return (
    <div className="all-myorder">
      {loading ? (
        <div className="loading-myorder">
          <span><LoadingOutlined></LoadingOutlined></span>
        </div>
      ) : (
        <div>
        {myOrdersPendding && myOrdersPendding.length > 0
          ? myOrdersPendding.map((item) => orderParent(item))
          : "Bạn không có đơn hàng nào"}
        </div>
        )}
    </div>
  );
}

export default PenddingOrder;
