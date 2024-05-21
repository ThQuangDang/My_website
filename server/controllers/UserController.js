const {UserModel} = require( '../models/UserModel.js')
const {generateToken} = require( '../untils/until.js')
const expressAsyncHandler = require( 'express-async-handler')

const getAllUser = (req, res) => {
    UserModel.find({})
        .then(user => res.send(user))
        .catch(err => console.log(err))
}

const registerUser = expressAsyncHandler(async (req, res) => {
    const user = new UserModel({
        // _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: '',
        phone: '',
        isAdmin: false,
    })
    const createUser = user.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        address: user.address ,
        phone: user.phone,
        token: generateToken(user),
    });
})

const login = expressAsyncHandler(async (req, res) => {
    const user = await  UserModel.findOne({email: req.body.email, password: req.body.password})
    if(user){ 
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            address: user.address ,
            phone: user.phone,
            isAdmin: user.isAdmin,
            token: generateToken(user),
        });
    }else{
        res.status(401).send({message: "invalid email or password"})
    }
})

const DeleteUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById({_id: req.params.id})

    if(user){
        await UserModel.deleteOne({_id: req.params.id});
        res.send({message: 'user deleted'})
    }else{
        res.send({message: 'user not exists'})
    }
})

const findUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById({ _id: req.body.id })

    if (user) {
        res.status(200).json(user); 
    } else {
        res.status(404).send({ message: 'User not exists' });
    }
});


module.exports = {
    DeleteUser,
    login,
    registerUser,
    getAllUser,
    findUser
}