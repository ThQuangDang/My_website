const { OrderModel } = require( "../models/OrderModel.js")
const expressAsyncHandler = require( "express-async-handler")

const querystring = require( "qs")
const sha256 = require( "sha256")
const { format } = require( "date-fns")
const crypto = require("crypto")

const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const url = process.env.VNP_URL;
const returnUrl = process.env.VNP_RETURN_URL;

const VNPAY_GATEWAY_SANDBOX_HOST = 'https://sandbox.vnpayment.vn';
const PAYMENT_ENDPOINT = 'paymentv2/vpcpay.html';
const HASH_ALGORITHM = 'SHA512';
const BUFFER_ENCODE = 'utf-8'

const createPayment = expressAsyncHandler(async (req, res) => {
  console.log('createPayment')
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    '192.168.1.9' ||
    req.socket.remoteAddress ||
    (req.connection && req.connection.remoteAddress) ||
    (req.connection?.socket && req.connection.socket.remoteAddress);


  const order = new OrderModel({
    order_code: "",
    to_ward_code: req.body.to_ward_code,
    to_district_id: req.body.to_district_id,
    cancelOrder: false,

    orderItems: req.body.orderItems,
    shippingAddress: {
      province: req.body.shippingAddress?.province || '',
      district: req.body.shippingAddress?.district  || '',
      ward: req.body.shippingAddress?.ward || '',
      detail: req.body.shippingAddress?.more || '',
      name: req.body.shippingAddress?.name || '',
      phone: req.body.shippingAddress?.phone || '',
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

  order.save();

  let vnpUrl = url;
  const date = new Date();

  const createDate = format(date, "yyyyMMddHHmmss");
  const orderId = order._id.toString();
  const totalPrice = order.totalPrice;
  console.log({orderId})

  var locale = "vn";
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;

  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "THANH TOAN DON HANG";
  vnp_Params["vnp_OrderType"] = "billpayment";
  vnp_Params["vnp_Amount"] = totalPrice*100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  vnp_Params["vnp_BankCode"] = "NCB";

  // new
  // var vnp_Params = {};
  // vnp_Params['vnp_Version'] = '2.1.0';
  // vnp_Params['vnp_Command'] = 'pay';
  // vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Locale'] = locale;

  // vnp_Params['vnp_CurrCode'] = currCode;
  // vnp_Params['vnp_TxnRef'] = orderId;
  // vnp_Params['vnp_OrderInfo'] = "Nap tien cho thue bao 0123456789";;
  // vnp_Params['vnp_OrderType'] = "billpayment";
  // vnp_Params['vnp_Amount'] = 10000000 * 100;
  // vnp_Params['vnp_ReturnUrl'] = returnUrl;
  // vnp_Params['vnp_IpAddr'] = ipAddr;
  // vnp_Params['vnp_CreateDate'] = createDate;
  // vnp_Params["vnp_BankCode"] = "NCB";
  // end

  vnp_Params = sortObject(vnp_Params);

  // var signData =
  //   secretKey + querystring.stringify(vnp_Params, { encode: false });

  // new code
  //var hmac = crypto.createHmac("sha512", secretKey);
  // console.log({hmac})
  //var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
  //vnp_Params['vnp_SecureHash'] = signed;
  // vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  // end

  // var secureHash = sha256(signData);

  //vnp_Params["vnp_SecureHashType"] = "SHA256";
  // vnp_Params["vnp_SecureHash"] = secureHash;

  // var signData = querystring.stringify(vnp_Params, { encode: false });
  // var hmac = crypto.createHmac("sha256", secretKey);
  // var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
  // vnp_Params['vnp_SecureHash'] = signed;

  const redirectUrl = new URL(
    resolveUrlString(
        VNPAY_GATEWAY_SANDBOX_HOST,
        PAYMENT_ENDPOINT
    ),
  );

  Object.entries(vnp_Params)
  .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
  .forEach(([key, value]) => {
      //Skip empty value
      if(!value || value === "" || value === undefined || value === null) {
          return
      }

      redirectUrl.searchParams.append(key, value.toString())
  })

  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(redirectUrl.search.slice(1).toString(), "utf-8")).digest("hex")

  // redirectUrl.searchParams.append("vnp_SecureHash", signed)
  vnp_Params['vnp_SecureHash'] = signed;

  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  console.log({ code: "00", data: vnpUrl })

  res.status(200).json({ code: "00", data: vnpUrl });
});

const returnPayment = expressAsyncHandler(async (req, res) => {
  console.log('returnPayment')
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    vnp_Params = sortObject(vnp_Params);
    // const signData =
    //   secretKey + querystring.stringify(vnp_Params, { encode: false });

    // // new code
    // // var signData = querystring.stringify(vnp_Params, { encode: false });
    // // var hmac = crypto.createHmac("sha512", secretKey);
    // // var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    // //end

    // const checkSum = sha256(signData);

    const searchParams = new URLSearchParams();
    Object.entries(vnp_Params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .forEach(([key, value]) => {
        //Skip empty value
        if(!value || value === "" || value === undefined || value === null) {
            return
        }
  
        searchParams.append(key, value.toString())
    })
  
    const hmac = crypto.createHmac("sha512", secretKey)
    const signed = hmac.update(Buffer.from(searchParams.toString(), "utf-8")).digest("hex")

    const id = vnp_Params.vnp_TxnRef;
    console.log(id);

    // res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
    // if (secureHash === checkSum) {
    //   console.log('if 1')
    //   if (vnp_Params.vnp_ResponseCode == "00") {
    //     console.log('if 2')
    //     res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
    //   } else {
    //     const DeleteOrder = await OrderModel.findById({ _id: id });
    //     await DeleteOrder.remove();
    //     res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
    //   }
    // } else {
    //   console.log('else')
    //   res.status(200).json({ code: "97" });
    // }
    if (secureHash === signed) {
      console.log('if 1');
      if (vnp_Params.vnp_ResponseCode === "00") {
        console.log('if 2');
        res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
      } else {
        // Xóa order nếu order.code rỗng
        const deleteOrder = await OrderModel.findOneAndDelete({ _id: id});
        console.log(deleteOrder)
        if (deleteOrder) {
          console.log('Order deleted successfully');
        } else {
          console.log('Order not found or has a code');
        }
        res.status(200).json({ code: vnp_Params.vnp_ResponseCode });
      }
    } else {
      console.log('else');
      res.status(200).json({ code: "97" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const inpPayment = async (req, res) => {
  console.log('inpPayment')
  let vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);

  // const signData =
  //   secretKey + querystring.stringify(vnp_Params, { encode: false });

  // const checkSum = sha256(signData);

  const searchParams = new URLSearchParams();
    Object.entries(vnp_Params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .forEach(([key, value]) => {
        //Skip empty value
        if(!value || value === "" || value === undefined || value === null) {
            return
        }
  
        searchParams.append(key, value.toString())
  })
  
  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(searchParams.toString(), "utf-8")).digest("hex")

  const id = vnp_Params.vnp_TxnRef;
  
  if (secureHash === signed) {
    var orderId = vnp_Params["vnp_TxnRef"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: "00", Message: "success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }
};

function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}

function resolveUrlString(host, path) {
  host = host.trim();
  path = path.trim();
  while (host.endsWith('/') || host.endsWith('\\')) {
      host = host.slice(0, -1);
  }
  while (path.startsWith('/') || path.startsWith('\\')) {
      path = path.slice(1);
  }
  return `${host}/${path}`;
}

module.exports = {
    inpPayment,
    returnPayment,
    createPayment
}
