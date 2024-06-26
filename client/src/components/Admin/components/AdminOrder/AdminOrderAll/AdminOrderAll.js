import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../../../../actions/OrderAction";
import ListOrder from "../AdminOrderUI/ListOrder";
import "../AdminOrder.css"
import { LoadingOutlined } from "@ant-design/icons"

function AdminOrderAll(props) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.allOrder.order);
  const { orderGhnInfo } = useSelector((state) => state.orderGhn);
  const orderGhn = useSelector(state => state.orderGhn)
  

  useEffect(() => {
    dispatch(getAllOrder());
  }, []);


  return (
    <div>
      {orders && orders.length > 0 ? (
        <ListOrder orders={orders}></ListOrder>
      ) : (
        <div className="loading-order">
        <span><LoadingOutlined></LoadingOutlined></span>
        </div>
      )}
    </div>
  );
}

export default AdminOrderAll;
