import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function VnPaySuccess() {
  const location = useLocation();
  const [value, setValue] = useState('');
  const { order } = useSelector((state) => state.orderInfo);
  const dispatch = useDispatch();
  console.log(order)
  

  useEffect(() => {
    const getResultVNPay = async () => {
      const query = location.search;
      const parsed = queryString.parse(query);
      const vnp_TxnRef = parsed.vnp_TxnRef;
      console.log(vnp_TxnRef);

      const { data } = await axios.get(
        `http://localhost:5000/payment/vnpay_return${query}`
      );
      console.log(data.code);
      console.log(query);
      setValue(data.code);

      if(order) {

        localStorage.removeItem("cartItems");

        const productsToSend = order.orderItems.map(item => ({
          _id: item._id,
          image: item.image,
          name: item.name,
          qty: item.qty,
        }));
    
        await axios.post("http://localhost:5000/send-mail", {
          products: productsToSend,
          item: 'Đặt Hàng',
          email: order.user.email
        })

        await axios.post("http://localhost:5000/products/minusamount", {
          products: productsToSend
        })

      } 

      if(data.code === '00') {
         dispatch({ type: "CART_EMTY" });
        localStorage.removeItem("cartItems");

        const { data } = await axios.post("http://localhost:5000/order/find", {
          id: vnp_TxnRef
        } 

        );
        console.log(data);
        const idUser = data.user;
        console.log(idUser);

        const res = await axios.post(`http://localhost:5000/user/find`, {
          id: idUser
        });
        console.log(res.data.email);
        
        const productsToSend = data.orderItems.map(item => ({
          _id: item._id,
          image: item.image,
          name: item.name,
          qty: item.qty,
        }));
    
        await axios.post("http://localhost:5000/send-mail", {
          products: productsToSend,
          item: 'Đặt Hàng',
          email: res.data.email
        })

        await axios.post("http://localhost:5000/products/minusamount", {
          products: productsToSend
        })
      }
    };

    getResultVNPay();
  }, []);
  return (
    <section id="order-success">
      <div className="order-success">
        {order || value === '00' ? (
          <>
            <span><CheckOutlined></CheckOutlined></span>
            <p className="open-p">Đặt hàng thành công</p>
            <div className="links">
              <Link to="/myOrder">Xem lại đơn hàng</Link>
              <Link to="/">Trang chủ</Link>
            </div>
          </>
        ) : (
          <>
            <span className="close"><CloseOutlined></CloseOutlined></span>
            <p className="close-span">Đặt hàng không thành công</p>
            <p className="close-p">Vui lòng quay lại giỏ hàng</p>
            <div className="links">
              <Link to="/cart">Quay lại giỏ hàng</Link>
              <Link to="/">Trang chủ</Link>
            </div>
          </>
        )}
      </div>
    </section>

  );
}
