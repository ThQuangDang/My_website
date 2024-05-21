const jwt = require( 'jsonwebtoken')
const multer = require( "multer")
const path = require( "path")

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
    },
    process.env.TOKEN_SECRET || "dangquangthai",
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer
    jwt.verify(
      token,
      process.env.TOKEN_SECRET || "dangquangthai",
      (err, decode) => {
        if (err) {
          res.status.send({ message: "invalid token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "no token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "invalid admin token" });
  }
};

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

function PinComment(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);

  return arr;
}

module.exports = {
    PinComment,
    upload,
    isAdmin,
    isAuth,
    generateToken
}

