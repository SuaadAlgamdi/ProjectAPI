const mongoose = require("mongoose")
const Joi = require("joi")


const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
})

//--------------------------------------------------City--------------------//
const citySchema = new mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  video: String,
  //--------------------------------------------------زي actors, Cast-------//
  restaurants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
  museums: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
  malls: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
  hotels: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
  touristPlaces: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Place",
    },
  ],
}) 

const cityAddJoi = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(1000).required(),
  photo: Joi.string().uri().min(1).max(1000).required(),
  video: Joi.string().uri().min(1).max(200),
  restaurants: Joi.array().items(Joi.objectId()).min(1),
  museums: Joi.array().items(Joi.objectId()).min(1),
  malls: Joi.array().items(Joi.objectId()).min(1),
  hotels: Joi.array().items(Joi.objectId()).min(1),
  touristPlaces: Joi.array().items(Joi.objectId()).min(1),
  events: Joi.array().items(Joi.objectId()).min(1),
})

const cityEditJoi = Joi.object({
  name: Joi.string().min(1).max(200),
  description: Joi.string().min(1).max(1000),
  photo: Joi.string().uri().min(1).max(1000),
  video: Joi.string().uri().min(1).max(200),
  restaurants: Joi.array().items(Joi.objectId()).min(1),
  museums: Joi.array().items(Joi.objectId()).min(1),
  malls: Joi.array().items(Joi.objectId()).min(1),
  hotels: Joi.array().items(Joi.objectId()).min(1),
  touristPlaces: Joi.array().items(Joi.objectId()).min(1),
  events: Joi.array().items(Joi.objectId()).min(1),
})
const City = mongoose.model("City", citySchema)

module.exports.City = City
module.exports.cityAddJoi = cityAddJoi
module.exports.cityEditJoi=cityEditJoi
