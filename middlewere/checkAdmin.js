const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkAdmin = async (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).send("token is missing")

  const decriptedToken = jwt.verify(token, process.env.JWT_SECREY_KEY)
  const userId = decriptedToken.id
  const user = await User.findById(userId).select("-__v -password")
  if (!user) return res.status(404).send("user not found")

  if(user.role!=="Admin") return res.status(403).send("you are not admin")

  

  next()
}
module.exports = checkAdmin
