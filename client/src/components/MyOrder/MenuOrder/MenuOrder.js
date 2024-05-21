import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderPenddingByUser,
  getOrderShippingByUser,
} from "../../../actions/OrderAction";

function MenuOrder(props) {
  const dispatch = useDispatch()
  const location = useLocation()
  console.log(location)

  const { userInfo } = useSelector((state) => state.userSignin);
  const { myOrdersPendding } = useSelector((state) => state.orderByUser);
  const { myOrdersShipping } = useSelector((state) => state.orderByUser);

  useEffect(() => {
    const getAllOrderPenddingAndShippingByUser = async () => {
      await dispatch(getOrderPenddingByUser(userInfo._id));
      dispatch(getOrderShippingByUser(userInfo._id));
    };

    getAllOrderPenddingAndShippingByUser();
  }, [dispatch]);

  return (
    <div className="myorder-menu">
      <div className={location.pathname === '/myOrder' ? 'myorder-menu-item active' : 'myorder-menu-item'}>
        <Link to={'/myOrder' }>Tất cả</Link>
      </div>
      <div className={location.pathname === '/myOrder/pendding' ? 'myorder-menu-item active' : 'myorder-menu-item'}>
        <Link to="/myOrder/pendding">Đã đặt hàng</Link>
        {myOrdersPendding ? (
          <div className="myorder-menu-item-newPendding">
            {myOrdersPendding.length}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={location.pathname === '/myOrder/shipping' ? 'myorder-menu-item active' : 'myorder-menu-item'}>
        <Link to="/myOrder/shipping">Đang vận chuyển</Link>
        {myOrdersShipping ? (
          <div className="myorder-menu-item-newShipping">
            {myOrdersShipping.length}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={location.pathname === '/myOrder/paid' ? 'myorder-menu-item active' : 'myorder-menu-item'}>
        <Link to="/myOrder/paid">Đơn hàng đã được giao</Link>
      </div>
    </div>
  );
}

export default MenuOrder;
