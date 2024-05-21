const expressAsyncHandler = require( 'express-async-handler')
const { ConversationModel } = require( '../models/ConversationModel.js')
const { MessageModel } = require( '../models/MessageModel.js')
const multer = require('multer') 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads')); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });  

const getAllConversation = expressAsyncHandler(async (req, res) => {
    const allConversation = await ConversationModel.find().sort({ updatedAt: -1} )
    res.send(allConversation)
})

const getMessageByConversation = async (req, res) => {
    try {
        const user = await ConversationModel.findOne({
            $or: [
                { idUser: req.query.idUser },
                { _id: req.query.idConversation }
            ]
        });

        if (!user) {
            return res.status(400).json({
                message: 'Thất bại'
            });
        }

        const messages = await MessageModel.find({
            idConversation: user._id
        }).populate('idConversation');

        return res.status(200).json({
            messageList: messages
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý'
        });
    }
};



const postSaveMessage = expressAsyncHandler(async (req, res) => {

    try {
        let messageData = {
          sender: req.body.sender,
          message: req.body.message,
          idConversation: req.body.idConversation,
        };
    
        // Nếu tồn tại file hình ảnh được gửi từ client
        if (req.file) {
          messageData.image = req.file.path; // Lưu đường dẫn của hình ảnh
        }
    
        const messageText = new MessageModel(messageData);
        const createMessage = await messageText.save();
    
        res.status(200).json(createMessage);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý' });
    }

})

module.exports = {
    getAllConversation,
    getMessageByConversation,
    postSaveMessage,
    upload
}