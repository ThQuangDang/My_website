const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const nodemailer = require('nodemailer')
const path = require('path')
const bodyParser = require('body-parser')

const connectDB  = require('./config/db/db.js')

const ProductRouter = require('./routers/ProductRouter.js')
const UserRouter = require('./routers/UserRouter.js')
const OrderRouter = require('./routers/OrderRouter.js')
const ChatRouter = require('./routers/ChatRouter.js')

const {createServer} = require('http')
// const {Server} = require('socket.io'

const {ConnectSocket} = require('./config/socket/socket.js')

const cloudinary = require('./config/cloudinary/cloudinary.js')
const PaymentRouter = require('./routers/PaymentRouter.js')
const SelectListrouter = require('./routers/SelectListRouter.js')
const ListTypeProductRouter = require('./routers/ListTypeProductRouter.js')

dotenv.config();
process.env.TOKEN_SECRET;

const app = express()
const PORT = process.env.PORT || 4000
const server = createServer(app)

ConnectSocket(server)
connectDB()

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use('/save', express.static(path.join(__dirname, '../public/uploads')));

app.use('/products', ProductRouter)
app.use('/user', UserRouter)
app.use('/order', OrderRouter)
app.use('/chat', ChatRouter)
app.use('/payment', PaymentRouter)
app.use('/selectList', SelectListrouter)
app.use('/typeList', ListTypeProductRouter)

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'dev_setups',
        });
        res.json({ msg: 'yaya' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/send-mail', async (req, res) => {
    const {products, email, item} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: 'quangdangthai2k3@gmail.com',
          pass: process.env.PASSWORD_ESC,
        },
      });

      let mailOptions;
    
      if(item == 'Đặt Hàng')
      {
        mailOptions = {
            from: 'quangdangthai2k3@gmail.com',
            to: email,
            subject: 'ShopDunk. Order create success',
            html: `
            <p style="font-size: 18px">We welcome you to Shopdunk-S.</p>
            <p>
                ${products.map(product => 
                    `<p style="font-size: 16px">Đơn hàng <strong>${product._id}</strong> của bạn đã được gửi:</p>
                    <p style="font-size: 14px"><strong>${product.name}</strong></p>
                    <img src=${product.image} style="width: 100px; height: 100px"></img>`  
                ).join('')}
            </p>
            <p style="font-size: 16px">Cảm ơn bạn đã mua sắm cùng Shopdunk-S.</p>
            <p style="font-size: 16px">Đơn hàng của bạn có vấn đề gì - Vui lòng nhắn tin và đánh giá để được shop hỗ trợ nha</p>
            `,
        };
      }else if(item == 'Xác nhận đơn hàng'){
        mailOptions = {
            from: 'quangdangthai2k3@gmail.com',
            to: email,
            subject: 'ShopDunk. Order being shipped',
            html: `
            <p style="font-size: 18px">We welcome you to Shopdunk-S.</p>
            <p>
                ${products.map(product => 
                    `<p style="font-size: 16px">Đơn hàng <strong>${product._id}</strong> của bạn đã được chuyển phát để vận chuyển:</p>
                    <p style="font-size: 14px"><strong>${product.name}</strong></p>
                    <img src=${product.image} style="width: 100px; height: 100px"></img>`  
                ).join('')}
            </p>
            <p style="font-size: 16px">Cảm ơn bạn đã mua sắm cùng Shopdunk-S.</p>
            <p style="font-size: 16px">Đơn hàng của bạn có vấn đề gì - Vui lòng nhắn tin và đánh giá để được shop hỗ trợ nha</p>
            `,
        };
      }else if(item == 'Hủy đơn'){
        mailOptions = {
            from: 'quangdangthai2k3@gmail.com',
            to: email,
            subject: 'ShopDunk. Order been cancelled',
            html: `
            <p style="font-size: 18px">We welcome you to Shopdunk-S.</p>
            <p>
                ${products.map(product => 
                    `<p style="font-size: 16px">Đơn hàng <strong>${product._id}</strong> của bạn đã được hủy:</p>
                    <p style="font-size: 14px"><strong>${product.name}</strong></p>
                    <img src=${product.image} style="width: 100px; height: 100px"></img>`  
                ).join('')}
            </p>
            <p style="font-size: 16px">Đơn hàng của bạn có vấn đề gì - Vui lòng nhắn tin và đánh giá để được shop hỗ trợ nha</p>
            `,
        };
      }   
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).send('Internal Server Error');
        } else {
          console.log(`Email sent: ${info.response}`);
          res.status(200).json({ success: true, message: 'Password reset email sent successfully' });
        }
    });
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`))