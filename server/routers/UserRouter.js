const express = require( 'express')
const {getAllUser, registerUser, login, DeleteUser, findUser} = require( '../controllers/UserController.js')
const UserRouter = express.Router()
const {isAuth, isAdmin} = require( '../untils/until.js')

UserRouter.post('/register', registerUser)
UserRouter.post('/login', login)

UserRouter.get('/', getAllUser)
UserRouter.delete('/delete/:id', DeleteUser)
UserRouter.post('/find', findUser)

module.exports = UserRouter
