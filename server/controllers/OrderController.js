const { OrderModel } = require( "../models/OrderModel.js")
const expressAsyncHandler = require( "express-async-handler")
const axios = require( "axios")
const dotenv = require( "dotenv")

dotenv.config();

const createOrder = expressAsyncHandler(async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: "cart is emty" });
  } else {
    const order = new OrderModel({
      order_code: "",
      to_ward_code: req.body.to_ward_code,
      to_district_id: req.body.to_district_id,
      cancelOrder: false,

      orderItems: req.body.orderItems,
      shippingAddress: {
        province: req.body.shippingAddress.province,
        district: req.body.shippingAddress.district,
        ward: req.body.shippingAddress.ward,
        detail: req.body.shippingAddress.more,
        name: req.body.shippingAddress.name,
        phone: req.body.shippingAddress.phone,
      },
      paymentMethod: req.body.paymentMethod,
      paymentResult: req.body.paymentResult
        ? {
            id: req.body.paymentResult.id,
            status: req.body.paymentResult.status,
            update_time: req.body.paymentResult.update_time,
            email_address: req.body.paymentResult.payer.email_address,
          }
        : "",
      totalPrice: req.body.totalPrice,
      status: req.body.status ? req.body.status : "pendding",
      name: req.body.name,
      user: req.body.user,
    });

    const createOrder = await order.save();
    res.status(201).send({ message: "new order created", order: createOrder });
  }
});

const clientCancelOrder = expressAsyncHandler(async (req, res) => {
  const updateOrder = await OrderModel.findById({_id: req.params.id})

   if(updateOrder){
    updateOrder.cancelOrder = true
    await updateOrder.save()
   }
   res.send(updateOrder)
});

const updateOrder = expressAsyncHandler(async (req, res) => {
  console.log('updateOrder')
  let updateOrder = await OrderModel.findById({ _id: req.params.id });
  console.log(updateOrder)

  if (updateOrder) {
    let items = [];
    updateOrder.orderItems.map((x) => {
      let item = {};
      item.name = x.name;
      item.quantity = parseInt(x.qty);
      item.price = x.salePrice;

      items.push(item);
    });

    const orderGhn = {
      "payment_type_id": 2,
      "note": "Cảm ơn đã mua hàng tại Shopdunk",
      "from_name":"Shopdunk-S",
      "from_phone":"0348039513",
      "from_address":"Số 36 Ngõ 80/1",
      "from_ward_name":"Phường Xuân Phương",
      "from_district_name":"Quận Nam Từ Liêm",
      "from_province_name":"TP Hà Nội",
      "required_note": "KHONGCHOXEMHANG",
      "return_name": "Shopdunk-S",
      "return_phone": "0348039513",
      "return_address": "Số 36 Ngõ 80/1",
      "return_ward_name": "Phường Xuân Phương",
      "return_district_name": "Quận Nam Từ Liêm",
      "return_province_name":"TP Hà Nội",
      "client_order_code": "",
      "to_name": updateOrder.name,
      "to_phone": updateOrder.shippingAddress.phone,
      to_address: `${updateOrder.shippingAddress.province}, ${updateOrder.shippingAddress.district}, ${updateOrder.shippingAddress.ward}, ${updateOrder.shippingAddress.detail}`,
      "to_ward_name":updateOrder.shippingAddress.ward,
      "to_district_name": updateOrder.shippingAddress.district,
      "to_province_name": updateOrder.shippingAddress.province,
      "cod_amount": parseInt(updateOrder.totalPrice/10),
      "content": "Theo New York Times",
      "weight": 200,
      "length": 1,
      "width": 19,
      "height": 10,
      "cod_failed_amount": 2000,
      "pick_station_id": 1444,
      "deliver_station_id": null,
      "insurance_value": 1000000,
      "service_id": 0,
      "service_type_id":2,
      "coupon":null,
      "pick_shift":null,
      "pickup_time": 1665272576,
      "items": items
    }
    updateOrder.order_code = req.params.id;
    await updateOrder.save();
    res.send(updateOrder);

    try {
      console.log('-----', orderGhn)
      const { data } = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        orderGhn,
        {
          headers: {
            'Content-Type': 'application/json',
            shop_id: process.env.SHOP_ID,
            token: process.env.TOKEN_GHN,
          },
        }
      );
      console.log({data})

      const order_code = data.data.order_code;

      updateOrder.order_code = order_code;
      await updateOrder.save();
      res.send(updateOrder);
    } catch (error) {
      console.log({error: error.message})
    }
  } else {
    res.send({ msg: "product not found" });
  }
});

const PrintOrderGhn = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.findById({ _id: req.params.id });
  if (Order) {
    let token;
    try {
      const { data } = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token",
        {
          headers: {
            Token: process.env.TOKEN_GHN,
          },
          params: {
            order_codes: Order.order_code,
          },
        }
      );

      token = data.data.token;
      Order.token = token;
      await Order.save();

      const result = await axios.get(
        `https://online-gateway.ghn.vn/a5/public-api/printA5?token=${token}`,
        {
          headers: {
            Token: process.env.TOKEN_GHN,
          },
        }
      );
      res.send(result.config.url);
    } catch (error) {
    }
    
  } else {
    res.send({message: 'order not found'})
  }
});


const GetAllOrder = expressAsyncHandler(async (req, res) => {
  //await OrderModel.remove()
  const Order = await OrderModel.find({}).sort({ createdAt: -1 });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const GetAllOrderPaypal = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ paymentMethod: "payOnline" }).sort({
    createdAt: -1,
  });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const GetAllOrderPendding = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    $or: [{ status: "pendding" }, { paymentMethod: "payOnline" }],
  }).sort({
    createdAt: -1,
  });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const GetAllOrderShipping = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ status: "shipping" }).sort({
    createdAt: -1,
  });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const GetAllOrderPaid = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ status: "paid" }).sort({
    createdAt: -1,
  });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const DeleteOrder = expressAsyncHandler(async (req, res) => {
  const deleteOrder = await OrderModel.findById(req.params.id);

  if (deleteOrder) {
    await deleteOrder.deleteOne();
    res.send({ message: "product deleted" });
  } else {
    res.send("error in delete order");
  }
});

const ShippingProduct = expressAsyncHandler(async (req, res) => {
  const status = "shipping";
  const Order = await OrderModel.findById({ _id: req.params.id });
  if (Order) {
    Order.status = status;
    await Order.save();
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

const PaidProduct = expressAsyncHandler(async (req, res) => {
  const status = "paid";
  const Order = await OrderModel.findByIdAndUpdate(
    { _id: req.params.id },
    { status: status }
  );
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order" });
  }
});

// --------------------    user

const GetOrderByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({ user : req.params.id }).sort({
    createdAt: -1,
  });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order by user" });
  }
});

const GetOrderPaypalByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    paymentMethod: "payOnline",
  }).sort({ createdAt: -1 });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order by user" });
  }
});

const GetOrderPenddingByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "pendding",
  }).sort({ createdAt: -1 });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order by user" });
  }
});

const GetOrderShippingByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "shipping",
  }).sort({ createdAt: -1 });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order by user" });
  }
});

const GetOrderPaidByUser = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    user: req.params.id,
    status: "paid",
  }).sort({ createdAt: -1 });
  if (Order) {
    res.send(Order);
  } else {
    res.status(401).send({ message: "no order by user" });
  }
});

const GetAllOrderInAMonth = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.find({
    createdAt: {
      $gte: new Date(2021, 7, 11),
      $lt: new Date(2021, 7, 16),
    },
  });

  if (Order) {
    res.send(Order);
  } else {
    res.status(400).send({ message: "no product in a month" });
  }
});

const findOrderById = expressAsyncHandler(async (req, res) => {
  const Order = await OrderModel.findById({ _id: req.body.id });

  if(Order) {
    res.send(Order);
  } else {
    res.status(400).send({ message: "no order" });
  }
});

module.exports = {
    createOrder,
    PrintOrderGhn,
    GetAllOrder,
    GetAllOrderInAMonth,
    GetAllOrderPaid,
    GetAllOrderPaypal,
    GetAllOrderPendding,
    GetAllOrderShipping,
    DeleteOrder,
    ShippingProduct,
    PaidProduct,
    GetOrderByUser,
    GetOrderPaidByUser,
    GetOrderPaypalByUser,
    GetOrderPenddingByUser,
    GetOrderShippingByUser,
    updateOrder,
    clientCancelOrder,
    findOrderById
}

