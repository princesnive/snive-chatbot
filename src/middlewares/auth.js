const jwt = require("jsonwebtoken");
// const User = require("../models/user");

const auth = async (req, res, next) => {
  // check for token
  if (!req.header("Authorization")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  //  verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return res.status(401).json({ msg: "Token is not valid" });
  }

  // req.user = await User.findById(decoded.id)
  req.user = await decoded.uid;

  //   console.log(req.user);

  next();
};

module.exports = auth;
