const express = require('express')
const { getAllConversation, postSaveMessage, getMessageByConversation, upload } = require('../controllers/ChatController.js')

const router = express.Router()

router.get('/', getAllConversation)

router.get('/message', getMessageByConversation);

router.post('/save', upload.single('image'), postSaveMessage);

module.exports = router